<template>
  <MyOverlayScrollbars v-if="!loading" :os-class="'artist-container'" :os-element="'main'">
    <div
      class="artist-container__cover"
      :style="{
        'background-image': `url(${artist.images.length !== 0 ? artist.images[0].url : ''})`
      }"
    >
      <div class="artist-container__cover__title">{{ artist.name }}</div>
      <div class="artist-container__cover__followers">
        {{
          Intl.NumberFormat().format(artist.followers.total) +
          (artist.followers.total === '1' ? ' follower' : ' followers')
        }}
      </div>
    </div>
    <div class="artist-container__content">
      <div v-if="tracks.length !== 0" class="artist-container__content__popular">
        <TitleSimple :title="'Popular'" />
        <div class="artist-container__content__popular__content">
          <TrackListHeader />
          <TrackCard
            v-for="(track, index) in tracks"
            :key="track.id"
            :index="index"
            :showArtists="false"
            :item="track"
          />
        </div>
      </div>
      <TitleWithPartialItems
        v-if="albums.length !== 0"
        :router-name="'ArtistAllAlbums'"
        :title="'Albums'"
        :card-type="'AlbumCard'"
        :items="albums"
      />
      <TitleWithPartialItems
        v-if="singles.length !== 0"
        :router-name="'ArtistAllSingles'"
        :title="'Singles'"
        :card-type="'AlbumCard'"
        :items="singles"
      />
      <TitleWithPartialItems
        v-if="appearsOn.length !== 0"
        :router-name="'ArtistAllAppearsOn'"
        :title="'Appears On'"
        :card-type="'AlbumCard'"
        :items="appearsOn"
      />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import TrackCard from '@/components/TrackCard/index.vue'
import TrackListHeader from '@/components/TrackListHeader/index.vue'
import artist from './data/artist.json'
import tracks from './data/tracks.json'
import albums from './data/albums.json'
import singles from './data/singles.json'
import appearsOn from './data/appearsOn.json'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import { getAlbums, getAppearsOn, getArtist, getSingles, getTopTracks } from '@/api/artists'
import AlbumCard from '@/components/AlbumCard/index.vue'
import ArtistCard from '@/components/ArtistCard/index.vue'
import TitleWithPartialItems from '@/components/TitleWithPartialItems/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'

export default {
  name: 'Artist',
  components: {
    MyOverlayScrollbars,
    TrackListHeader,
    TrackCard,
    AlbumCard,
    ArtistCard,
    TitleWithPartialItems,
    TitleSimple
  },
  data() {
    return {
      id: this.$route.params.artistId,
      artist: {},
      tracks: {},
      albums: {},
      singles: {},
      appearsOn: {},
      compilations: {},
      loading: true
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
      const res = (await getArtist(this.id)).data
      this.artist = res
    },
    async getTopTracks() {
      const res = (await getTopTracks(this.id)).data.tracks
      this.tracks = res
    },
    async getAlbums() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getAlbums(this.id, params)).data.items
      this.albums = res
    },
    async getSingles() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getSingles(this.id, params)).data.items
      this.singles = res
    },
    async getAppearsOn() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getAppearsOn(this.id, params)).data.items
      this.appearsOn = res
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  height: inherit;

  &__cover {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 50%;
    padding: 6rem 2.4rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    &__title {
      font-size: 9.6rem;
      font-family: $font-family-title;
      font-weight: 800;
      text-shadow: 0 0 15px rgba(0, 0, 0, 0.4);

      @include oneLineEllipsis;
    }

    &__followers {
      font-size: 1.6rem;
      text-shadow: 0 0 10px rgba(0, 0, 0, 1);
    }
  }

  &__content {
    padding: 2.4rem;
    &__popular {
      padding: 2.4rem 0;
    }
  }
}
</style>
