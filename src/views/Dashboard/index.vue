<template>
  <div class="dashboard-container" v-if="!loading">
    <div class="dashboard-container__top-songs" v-if="tracks.length !== 0">
      <TitleShowAll title="Top Songs" />
      <div class="dashboard-container__top-songs__content">
        <CardHorizontal v-for="item in tracks" :item="item" />
      </div>
    </div>
    <div class="dashboard-container__featured-playlists">
      <TitleShowAll
        :router-name="playlists_total > playlists_limit ? 'FeaturedPlaylists' : ''"
        title="Featured Playlists"
      />
      <div class="dashboard-container__featured-playlists__content">
        <PlaylistCard v-for="item in playlists" :item="item" />
      </div>
    </div>
    <div class="dashboard-container__top-artists" v-if="artists.length !== 0">
      <TitleShowAll title="Top Artists" />
      <div class="dashboard-container__top-artists__content">
        <ArtistCard v-for="item in artists" :item="item" />
      </div>
    </div>
    <div class="dashboard-container__new-releases">
      <TitleShowAll title="New Releases" />
      <div class="dashboard-container__new-releases__content">
        <AlbumCard v-for="item in albums" :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import Container from '@/components/Container/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import AlbumCard from '@/components/CardAlbum/index.vue'
import CardHorizontal from '@/components/CardHorizontal/index.vue'
import { getFeaturedPlaylists } from '@/api/meta/browse'
import { getUserTopArtists, getUserTopSongs } from '@/api/meta/user'
import { getNewReleases, getNextNewReleases } from '@/api/meta/album'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Dashboard',
  components: {
    Container,
    PlaylistCard,
    TitleShowAll,
    ArtistCard,
    AlbumCard,
    CardHorizontal
  },
  data() {
    return {
      playlists: [],
      playlists_total: 0,
      playlists_limit: 8,
      artists: [],
      artists_limit: 8,
      tracks: [],
      tracks_limit: 8,
      albums: [],
      albums_limit: 24,
      albums_offset: 0,
      albums_next: '',
      loading_more: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getUserTopSongs()
      await this.getPlaylists()
      await this.getUserTopArtists()
      await this.getNewReleases()

      this.loading = false
    },
    async getUserTopSongs() {
      const params = {
        time_range: 'short_term',
        limit: this.tracks_limit,
        offset: 0
      }
      const res = (await getUserTopSongs(params)).items
      this.tracks = res
    },
    async getPlaylists() {
      const params = {
        limit: this.playlists_limit,
        offset: 0
      }
      const res = (await getFeaturedPlaylists(params)).playlists
      this.playlists = res.items
      this.playlists_total = res.total
    },
    async getUserTopArtists() {
      const params = {
        time_range: 'short_term',
        limit: this.artists_limit,
        offset: 0
      }
      const res = (await getUserTopArtists(params)).items
      this.artists = res
    },
    async getNewReleases() {
      if (!this.loading_more && this.albums_next !== null) {
        this.loading_more = true
        let res

        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await getNewReleases(params)).albums
        } else {
          let path = this.albums_next
          res = (await getNextNewReleases(path.slice(path.indexOf('?') + 1))).albums
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))
        this.albums = [...oldVals, ...newVals]

        this.albums_next = res.next
        this.loadMore = false
      }
      this.loading_more = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getNewReleases()
      }
    }
  },
  created() {
    this.getAll()
  },
  beforeUnmount() {
    this.loading = true
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 1.6rem;
  background: linear-gradient(to bottom, $color-bg-5 0rem, transparent 50rem);

  &__top-songs {
    &__content {
      padding: 1.6rem;
      gap: $gutter-2x;

      @include gridCardsLess;
    }
  }

  &__featured-playlists,
  &__top-artists,
  &__new-releases {
    &__content {
      @include gridCards;
    }
  }
}
</style>
