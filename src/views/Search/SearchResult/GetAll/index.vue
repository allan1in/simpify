<template>
  <main class="all-container">
    <div v-if="!loading" class="all-container__content">
      <div v-if="showTypes.track" class="all-container__content__songs">
        <h1 class="all-container__content__songs__title">
          <router-link :to="{ name: 'GetTracks' }">Songs</router-link>
        </h1>
        <div class="all-container__content__songs__results">
          <TrackListHeader />
          <TrackCard
            v-for="(item, index) in tracks.items"
            :key="index"
            :item="item"
            :index="index"
          />
        </div>
      </div>
      <div v-if="showTypes.artist" class="all-container__content__artists">
        <h1 class="all-container__content__artists__title">
          <router-link :to="{ name: 'GetArtists' }">Artists</router-link>
        </h1>
        <div class="all-container__content__artists__results">
          <ArtistCard
            v-for="(item, index) in artists.items"
            :key="index"
            :item="item"
            :index="index"
          />
        </div>
      </div>
      <div v-if="showTypes.album" class="all-container__content__albums">
        <h1 class="all-container__content__albums__title">
          <router-link :to="{ name: 'GetAlbums' }">Albums</router-link>
        </h1>
        <div class="all-container__content__albums__results">
          <AlbumCard
            v-for="(item, index) in albums.items"
            :key="index"
            :item="item"
            :index="index"
          />
        </div>
      </div>
    </div>
    <Loading :loading="loading" />
  </main>
</template>

<script>
import AlbumCard from '../GetAlbums/AlbumCard.vue'
import ArtistCard from '../GetArtists/ArtistCard.vue'
import TrackCard from '../GetTracks/TrackCard.vue'
import TrackListHeader from '../GetTracks/TrackListHeader.vue'
import Loading from '@/components/Loading/index.vue'
import { searchAlbums } from '@/api/search'
import { searchArtists } from '@/api/search'
import { searchTracks } from '@/api/search'
import { debounce } from '@/utils/debounce'

export default {
  name: 'GetAll',
  components: {
    TrackCard,
    ArtistCard,
    AlbumCard,
    TrackListHeader,
    Loading
  },
  data() {
    return {
      tracks: {},
      artists: {},
      albums: {},
      loading: true
    }
  },
  props: ['showTypes'],
  methods: {
    getAll: debounce(async function () {
      if (this.$route.params.inputContent) {
        await Promise.all([this.getTracks(), this.getArtists(), this.getAlbums()])
        this.loading = false
      }
    }),
    async getTracks() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 4,
        offset: 0
      }
      const res = (await searchTracks(params)).data.tracks
      this.tracks = res
    },
    async getArtists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 7,
        offset: 0
      }
      const res = (await searchArtists(params)).data.artists
      this.artists = res
    },
    async getAlbums() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 7,
        offset: 0
      }
      const res = (await searchAlbums(params)).data.albums
      this.albums = res
    }
  },
  mounted() {
    this.getAll()
  },
  watch: {
    $route(to, from) {
      this.getAll()
    }
  }
}
</script>

<style lang="scss" scoped>
.all-container {
  height: inherit;

  &__content {
    &__songs {
      &__title {
        font-family: $font-family-title;
        font-size: 2.4rem;
        padding-bottom: 2.4rem;
      }
    }

    &__artists {
      padding-top: 2.4rem;

      &__title {
        font-family: $font-family-title;
        font-size: 2.4rem;
        padding-bottom: 2.4rem;
      }

      &__results {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
      }
    }

    &__albums {
      padding-top: 2.4rem;

      &__title {
        font-family: $font-family-title;
        font-size: 2.4rem;
        padding-bottom: 2.4rem;
      }

      &__results {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
      }
    }
  }
}
</style>
