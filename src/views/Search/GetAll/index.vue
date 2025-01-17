<template>
  <template v-if="!loading_skeleton">
    <main class="all-container">
      <div class="all-container__content">
        <div v-if="tracks_total" class="all-container__content__songs">
          <TitleShowAll
            :router-name="tracks_total > tracks_limit ? 'GetTracks' : ''"
            :title="$t('get_all.songs')"
          />
          <div class="all-container__content__songs__results">
            <TrackListHeader />
            <CardTrack
              v-for="(item, index) in tracks"
              :key="item.id"
              :item="item"
              :index="index"
              :uris="uris"
            />
          </div>
        </div>
        <div v-if="artists_total" class="all-container__content__artists">
          <TitleShowAll
            :router-name="artists_total > artists_limit ? 'GetArtists' : ''"
            :title="$t('get_all.artists')"
          />
          <div class="all-container__content__artists__results">
            <CardArtist
              v-for="(item, index) in artists"
              :key="item.id"
              :item="item"
              :index="index"
              :uris="uris"
            />
          </div>
        </div>
        <div v-if="albums_total" class="all-container__content__albums">
          <TitleShowAll
            :router-name="albums_total > albums_limit ? 'GetAlbums' : ''"
            :title="$t('get_all.albums')"
          />
          <div class="all-container__content__albums__results">
            <CardAlbum
              v-for="(item, index) in albums"
              :key="item.id"
              :item="item"
              :index="index"
              :uris="uris"
            />
          </div>
        </div>
        <div v-if="playlists_total" class="all-container__content__playlists">
          <TitleShowAll
            :router-name="playlists_total > playlists_limit ? 'GetPlaylists' : ''"
            :title="$t('get_all.playlists')"
          />
          <div class="all-container__content__playlists__results">
            <CardPlaylist
              v-for="(item, index) in playlists"
              :key="item.id"
              :item="item"
              :index="index"
              :uris="uris"
            />
          </div>
        </div>
      </div>
    </main>
  </template>
  <template v-else>
    <main class="all-container">
      <div class="all-container__content">
        <div class="all-container__content__songs">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="all-container__content__songs__results">
            <TrackListHeader :loading="loading_skeleton" />
            <CardTrack v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="all-container__content__artists">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="all-container__content__artists__results">
            <CardArtist v-for="i in artists_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="all-container__content__albums">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="all-container__content__albums__results">
            <CardAlbum v-for="i in albums_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="all-container__content__playlists">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="all-container__content__playlists__results">
            <CardPlaylist v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
      </div>
    </main>
  </template>
</template>

<script>
import CardAlbum from '@/components/CardAlbum/index.vue'
import CardArtist from '@/components/CardArtist/index.vue'
import CardTrack from '@/components/CardTrack/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { searchAlbums, searchPlaylists } from '@/api/meta/search'
import { searchArtists } from '@/api/meta/search'
import { searchTracks } from '@/api/meta/search'
import { debounce } from '@/utils/debounce'
import TitleShowAll from '@/components/TitleShowAll/index.vue'

export default {
  name: 'GetAll',
  components: {
    CardTrack,
    CardArtist,
    CardAlbum,
    CardPlaylist,
    TrackListHeader,
    TitleShowAll
  },
  data() {
    return {
      tracks: [],
      tracks_limit: 4,
      tracks_offset: 0,
      tracks_total: 0,
      artists: [],
      artists_limit: 8,
      artists_offset: 0,
      artists_total: 0,
      albums: [],
      albums_limit: 8,
      albums_offset: 0,
      albums_total: 0,
      playlists: [],
      playlists_limit: 8,
      playlists_offset: 0,
      playlists_total: 0,
      loading_skeleton: true
    }
  },
  computed: {
    uris() {
      let uris = []
      this.tracks.forEach((item) => {
        uris.push(item.uri)
      })
      return uris
    }
  },
  methods: {
    debouncedGetAll() {},
    async getAll() {
      const input = this.$route.params.inputContent.trim()
      if (input) {
        await Promise.all([
          this.getTracks(),
          this.getArtists(),
          this.getAlbums(),
          this.getPlaylists()
        ])

        this.loading_skeleton = false
      } else {
        this.loading_skeleton = false
      }
    },
    async getTracks() {
      const params = {
        q: this.$route.params.inputContent,
        limit: this.tracks_limit,
        offset: this.tracks_offset
      }
      const res = (await searchTracks(params)).tracks
      this.tracks = res.items.filter((item) => !!item)
      this.tracks_total = res.total
    },
    async getArtists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: this.artists_limit,
        offset: this.artists_offset
      }
      const res = (await searchArtists(params)).artists
      this.artists = res.items.filter((item) => !!item)
      this.artists_total = res.total
    },
    async getAlbums() {
      const params = {
        q: this.$route.params.inputContent,
        limit: this.albums_limit,
        offset: this.albums_offset
      }
      const res = (await searchAlbums(params)).albums
      this.albums = res.items.filter((item) => !!item)
      this.albums_total = res.total
    },
    async getPlaylists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: this.playlists_limit,
        offset: this.playlists_offset
      }
      const res = (await searchPlaylists(params)).playlists
      this.playlists = res.items.filter((item) => !!item)
      this.playlists_total = res.total
    }
  },
  async created() {
    this.debouncedGetAll = debounce(this.getAll)
    await this.debouncedGetAll()
  },
  watch: {
    $route() {
      this.loading_skeleton = true
      this.debouncedGetAll()
    }
  }
}
</script>

<style lang="scss" scoped>
.all-container {
  min-height: inherit;

  &__content {
    padding: $gutter-1-5x;

    &__songs__results {
      margin: 0 $gutter-1-5x;
    }

    &__artists,
    &__albums,
    &__playlists {
      padding-top: $gutter-1-5x;

      &__results {
        @include gridCardsLess;
      }
    }
  }
}
</style>
