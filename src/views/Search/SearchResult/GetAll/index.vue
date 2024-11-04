<template>
  <main class="all-container" v-if="!loading">
    <div v-if="!loading" class="all-container__content">
      <div v-if="tracks_total" class="all-container__content__songs">
        <TitleShowAll
          :router-name="tracks_total > tracks_limit ? 'GetTracks' : ''"
          :title="'Songs'"
        />
        <div class="all-container__content__songs__results">
          <TrackListHeader />
          <TrackCard
            v-for="(item, index) in tracks"
            :key="index"
            :item="item"
            :index="index"
            :uris="uris"
          />
        </div>
      </div>
      <TitleWithPartialItems
        v-if="artists.total"
        :router-name="'GetArtists'"
        :title="'Artists'"
        :limit="artists.limit"
        :total="artists.total"
        :artist-card-props="{ items: artists.items }"
      />
      <TitleWithPartialItems
        v-if="albums.total"
        :router-name="'GetAlbums'"
        :title="'Albums'"
        :limit="albums.limit"
        :total="albums.total"
        :album-card-props="{ items: albums.items }"
      />
      <TitleWithPartialItems
        v-if="playlists.total"
        :router-name="'GetPlaylists'"
        :title="'Playlists'"
        :limit="playlists.limit"
        :total="playlists.total"
        :playlist-card-props="{ items: playlists.items }"
      />
    </div>
  </main>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { searchAlbums, searchPlaylists } from '@/api/meta/search'
import { searchArtists } from '@/api/meta/search'
import { searchTracks } from '@/api/meta/search'
import { debounce } from '@/utils/debounce'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import TitleWithPartialItems from '@/components/TitleWithPartialItems/index.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'GetAll',
  components: {
    TrackCard,
    ArtistCard,
    AlbumCard,
    TrackListHeader,
    TitleShowAll,
    TitleWithPartialItems
  },
  data() {
    return {
      tracks: [],
      tracks_limit: 4,
      tracks_offset: 0,
      artists: {},
      artists_limit: 8,
      artists_offset: 0,
      albums: {},
      albums_limit: 8,
      albums_offset: 0,
      playlists: {},
      playlists_limit: 8,
      playlists_offset: 0
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading']),
    uris() {
      let uris = []
      this.tracks.forEach((item) => {
        uris.push(item.uri)
      })
      return uris
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
        limit: this.tracks_limit,
        offset: this.tracks_offset
      }
      const res = (await searchTracks(params)).tracks
      this.tracks = res.items
      this.tracks_total = res.total
    },
    async getArtists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: this.artists_limit,
        offset: this.artists_offset
      }
      const res = (await searchArtists(params)).artists
      this.artists = res
    },
    async getAlbums() {
      const params = {
        q: this.$route.params.inputContent,
        limit: this.albums_limit,
        offset: this.albums_offset
      }
      const res = (await searchAlbums(params)).albums
      this.albums = res
    },
    async getPlaylists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: this.playlists_limit,
        offset: this.playlists_offset
      }
      const res = (await searchPlaylists(params)).playlists
      this.playlists = res
    }
  },
  created() {
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
