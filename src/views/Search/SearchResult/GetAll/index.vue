<template>
  <main class="all-container">
    <div v-if="!loading" class="all-container__content">
      <div v-if="tracks.total" class="all-container__content__songs">
        <TitleShowAll :router-name="'GetTracks'" :title="'Songs'" />
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
      <TitleWithPartialItems
        v-if="artists.total"
        :router-name="'GetArtists'"
        :title="'Artists'"
        :artist-card-props="{ items: artists.items }"
      />
      <TitleWithPartialItems
        v-if="albums.total"
        :router-name="'GetAlbums'"
        :title="'Albums'"
        :album-card-props="{ items: albums.items }"
      />
      <TitleWithPartialItems
        v-if="playlists.total"
        :router-name="'GetPlaylists'"
        :title="'Playlists'"
        :playlist-card-props="{ items: playlists.items }"
      />
    </div>
    <Loading :loading="loading" />
  </main>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { searchAlbums, searchPlaylists } from '@/api/search'
import { searchArtists } from '@/api/search'
import { searchTracks } from '@/api/search'
import { debounce } from '@/utils/debounce'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import TitleWithPartialItems from '@/components/TitleWithPartialItems/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetAll',
  components: {
    TrackCard,
    ArtistCard,
    AlbumCard,
    TrackListHeader,
    TitleShowAll,
    TitleWithPartialItems,
    Loading
  },
  data() {
    return {
      tracks: {},
      artists: {},
      albums: {},
      playlists: {},
      loading: true
    }
  },
  methods: {
    getAll: debounce(async function () {
      if (this.$route.params.inputContent) {
        await this.getTracks()
        await this.getArtists()
        await this.getAlbums()
        await this.getPlaylists()
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
    },
    async getPlaylists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 7,
        offset: 0
      }
      const res = (await searchPlaylists(params)).data.playlists
      this.playlists = res
    }
  },
  mounted() {
    this.getAll()
  },
  watch: {
    $route(to, from) {
      this.loading = true
      this.getAll()
    }
  }
}
</script>

<style lang="scss" scoped>
.all-container {
  min-height: inherit;

  &__content {
    padding: 1.6rem;

    &__songs {
      &__title {
        padding-bottom: 1.6rem;

        @include titleStyles;
      }
    }
  }
}
</style>
