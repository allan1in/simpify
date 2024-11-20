<template>
  <template v-if="!loading_skeleton">
    <div class="artist-container">
      <div class="artist-container__cover" :style="{
        'background-image': `url(${artist.images?.length !== 0 ? artist.images[0].url : ''})`
      }">
        <h1 class="artist-container__cover__title" :title="artist.name">{{ artist.name }}</h1>
        <div class="artist-container__cover__followers" v-if="artist.followers.total !== 0">
          {{
            `${Intl.NumberFormat().format(artist.followers.total)} ${$t('artist.follower', artist.followers.total)}`
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
          <TitleShowAll :title="$t('artist.popular')" />
          <div class="artist-container__content__popular__content">
            <TrackListHeader />
            <TrackCard v-for="(track, index) in tracks" :key="track.id" :index="index" :showArtists="false"
              :item="track" :uris="uris" />
          </div>
        </div>
        <div class="artist-container__content__albums" v-if="albums.length !== 0">
          <TitleShowAll :router-name="albums_total > albums_limit ? 'ArtistAllAlbums' : ''"
            :title="$t('artist.albums')" />
          <div class="artist-container__content__albums__content">
            <AlbumCard v-for="(item, index) in albums" :key="item.id" :item="item" :index="index"
              :show-artists="false" />
          </div>
        </div>
        <div class="artist-container__content__singles" v-if="singles.length !== 0">
          <TitleShowAll :router-name="singles_total > singles_limit ? 'ArtistAllSingles' : ''"
            :title="$t('artist.singles')" />
          <div class="artist-container__content__singles__content">
            <AlbumCard v-for="(item, index) in singles" :key="item.id" :item="item" :index="index"
              :show-artists="false" />
          </div>
        </div>
        <div class="artist-container__content__appears-on" v-if="appearsOn.length !== 0">
          <TitleShowAll :router-name="appearsOn_total > appearsOn_limit ? 'ArtistAllAppearsOn' : ''"
            :title="$t('artist.appears_on')" />
          <div class="artist-container__content__appears-on__content">
            <AlbumCard v-for="(item, index) in appearsOn" :key="item.id" :item="item" :index="index"
              :show-artists="false" />
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="artist-container">
      <div class="artist-container__cover">
        <Skeleton class="skeleton__title" />
        <Skeleton class="skeleton__info" />
      </div>
      <div class="artist-container__content">
        <div class="artist-container__content__btn-group">
          <div class="artist-container__content__btn-group__play-wrapper">
            <Skeleton shape="circle" />
          </div>
        </div>
        <div class="artist-container__content__popular">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="artist-container__content__popular__content">
            <TrackListHeader :loading="loading_skeleton" />
            <TrackCard v-for="i in 10" :key="i" :show-artists="false" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="artist-container__content__albums">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="artist-container__content__albums__content">
            <AlbumCard v-for="i in albums_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="artist-container__content__singles">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="artist-container__content__singles__content">
            <AlbumCard v-for="i in singles_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="artist-container__content__appears-on">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="artist-container__content__appears-on__content">
            <AlbumCard v-for="i in appearsOn_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { getAlbums, getAppearsOn, getArtist, getSingles, getTopTracks } from '@/api/meta/artist'
import AlbumCard from '@/components/CardAlbum/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'Artist',
  components: {
    TrackListHeader,
    TrackCard,
    AlbumCard,
    ArtistCard,
    TitleShowAll,
    ButtonTogglePlay,
    Skeleton
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
      loading_more: false,
      loading_skeleton: true
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

      this.loading_skeleton = false
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
        this.loading = false
        this.id = to.params.artistId
        this.loading_skeleton = true
        await this.getAll()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  &__title {
    height: $font-size-title-large;
    width: 30%;
  }

  &__info {
    height: $font-size-text-primary;
    width: 10%;
    margin-top: $font-size-text-primary;
  }
}

.artist-container {
  &__cover {
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
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
      background: linear-gradient(to bottom, rgba($color-bg-6, 0.2), rgba($color-bg-6, 0.8));
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
      line-height: 1.4;

      @include respondContainer(phone) {
        font-size: 4rem;
        margin: -0.6rem;
        padding: 0.6rem;
      }

      @include oneLineEllipsis;
    }

    &__followers {
      font-size: $font-size-text-primary;
      text-shadow: 0 0 10px rgba(0, 0, 0, 1);
      z-index: 10;
    }
  }

  &__content {
    padding: $gutter-1-5x;

    &__btn-group {
      padding: $gutter-1-5x;

      &__play-wrapper {
        height: 5.4rem;
        width: 5.4rem;
      }
    }

    &__popular {
      padding: $gutter-1-5x 0;

      &__content {
        margin: 0 $gutter-1-5x;
      }
    }

    &__albums,
    &__singles,
    &__appears-on {
      &__content {
        @include gridCardsLess;
      }
    }
  }
}
</style>
