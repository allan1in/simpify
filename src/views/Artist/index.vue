<template>
  <div class="artist-container" v-if="!loading">
    <div class="artist-container__cover" :style="{
      'background-image': `url(${artist.images?.length !== 0 ? artist.images[0].url : ''})`
    }">
      <h1 class="artist-container__cover__title" :title="artist.name">{{ artist.name }}</h1>
      <div class="artist-container__cover__followers">
        {{
          Intl.NumberFormat().format(artist.followers.total) +
          (artist.followers.total === '1' ? ' follower' : ' followers')
        }}
      </div>
    </div>
    <div class="artist-container__content">
      <div class="artist-container__content__btn-group">
        <div class="artist-container__content__btn-group__play-wrapper">
          <ButtonTogglePlay :item="artist" />
        </div>
      </div>
      <div v-if="tracks.length !== 0" class="artist-container__content__popular">
        <TitleShowAll :title="'Popular'" />
        <div class="artist-container__content__popular__content">
          <TrackListHeader />
          <TrackCard v-for="(track, index) in tracks" :key="track.id" :index="index" :showArtists="false" :item="track"
            :uris="uris" />
        </div>
      </div>
      <TitleWithPartialItems v-if="albums.length !== 0" :router-name="'ArtistAllAlbums'" :limit="albums_limit"
        :total="albums_total" :title="'Albums'"
        :album-card-props="{ items: albums, showAlbumType: true, showArtists: false }" />
      <TitleWithPartialItems v-if="singles.length !== 0" :router-name="'ArtistAllSingles'" :limit="singles_limit"
        :total="singles_total" :title="'Singles'"
        :album-card-props="{ items: singles, showAlbumType: true, showArtists: false }" />
      <TitleWithPartialItems v-if="appearsOn.length !== 0" :router-name="'ArtistAllAppearsOn'" :limit="appearsOn_limit"
        :total="appearsOn_total" :title="'Appears On'"
        :album-card-props="{ items: appearsOn, showAlbumType: true, showArtists: false }" />
    </div>
  </div>
</template>

<script>
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { getAlbums, getAppearsOn, getArtist, getSingles, getTopTracks } from '@/api/meta/artist'
import AlbumCard from '@/components/CardAlbum/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import TitleWithPartialItems from '@/components/TitleWithPartialItems/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'

export default {
  name: 'Artist',
  components: {
    TrackListHeader,
    TrackCard,
    AlbumCard,
    ArtistCard,
    TitleWithPartialItems,
    TitleShowAll,
    ButtonTogglePlay
  },
  data() {
    return {
      id: this.$route.params.artistId,
      artist: {},
      tracks: [],
      albums: {},
      albums_limit: 8,
      albums_offset: 0,
      albums_total: 0,
      singles: {},
      singles_limit: 8,
      singles_offset: 0,
      singles_total: 0,
      appearsOn: {},
      appearsOn_limit: 8,
      appearsOn_offset: 0,
      appearsOn_total: 0,
      loading_more: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading']),
    uris() {
      let uris = []
      this.tracks.forEach((item) => {
        uris.push(item.uri)
      })
      return uris
    }
  },
  methods: {
    async getAll() {
      await this.getArtist()
      await this.getTopTracks()
      await this.getAlbums()
      await this.getSingles()
      await this.getAppearsOn()
      this.loading = false
    },
    async getArtist() {
      const res = await getArtist(this.id)
      this.artist = res
    },
    async getTopTracks() {
      const res = (await getTopTracks(this.id)).tracks
      this.tracks = res
    },
    async getAlbums() {
      const params = {
        limit: this.albums_limit,
        offset: this.albums_offset
      }
      const res = await getAlbums(this.id, params)
      this.albums = res.items
      this.albums_total = res.total
    },
    async getSingles() {
      const params = {
        limit: this.singles_limit,
        offset: this.singles_offset
      }
      const res = await getSingles(this.id, params)
      this.singles = res.items
      this.singles_total = res.total
    },
    async getAppearsOn() {
      const params = {
        limit: this.appearsOn_limit,
        offset: this.appearsOn_offset
      }
      const res = await getAppearsOn(this.id, params)
      this.appearsOn = res.items
      this.appearsOn_total = res.total
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.id = to.params.artistId
        await this.getAll()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  &__cover {
    background-image: url('https://i.scdn.co/image/ab67616d0000b2737c20fb440980c4f2f24346c5');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 50%;
    padding: 6.4rem $gutter-4x;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
    position: relative;

    &::before {
      content: ' ';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba($color-bg-6, 0.1), rgba($color-bg-6, 0.3));
    }

    &__title {
      font-size: $font-size-title-large;
      font-family: $font-family-title;
      font-weight: 800;
      text-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
      // Prevent shadows from being hidden due to 'overflow:hidden'
      margin: -2rem;
      padding: 2rem;
      z-index: 10;

      @include respond(phone) {
        font-size: 4rem;
        margin: -0.6rem;
        padding: 0.6rem;
      }

      @include oneLineEllipsis;
    }

    &__followers {
      font-size: 1.6rem;
      text-shadow: 0 0 10px rgba(0, 0, 0, 1);
      z-index: 10;
    }
  }

  &__content {
    padding: 1.6rem;

    &__btn-group {
      padding: 0 $gutter-2x;
      padding-top: $gutter-2x;

      &__play-wrapper {
        height: 5.4rem;
        width: 5.4rem;
      }
    }

    &__popular {
      padding: 1.6rem 0;
    }
  }
}
</style>
