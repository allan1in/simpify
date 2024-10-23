<template>
  <Container :loading @load-more="getNewReleases">
    <div class="dashboard-container">
      <div class="dashboard-container__top-songs">
        <TitleShowAll title="Top Songs" />
        <div class="dashboard-container__top-songs__content">
          <CardHorizontal v-for="item in tracks" :item="item" />
        </div>
      </div>
      <div class="dashboard-container__featured-playlists">
        <TitleShowAll :router-name="playlists_total>playlists_limit?'FeaturedPlaylists':''" title="Featured Playlists" />
        <div class="dashboard-container__featured-playlists__content">
          <PlaylistCard v-for="item in playlists" :item="item" />
        </div>
      </div>
      <div class="dashboard-container__top-artists">
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
  </Container>
</template>

<script>
import Container from '@/components/Container/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import AlbumCard from '@/components/CardAlbum/index.vue'
import CardHorizontal from '@/components/CardHorizontal/index.vue'
import { getFeaturedPlaylists } from '@/api/browse'
import { getUserTopArtists, getUserTopSongs } from '@/api/user'
import { getNewReleases, getNextNewReleases } from '@/api/album'

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
      loading: true,
      playlists: [],
      playlists_total:0,
      playlists_limit: 7,
      artists: [],
      artists_limit: 7,
      tracks: [],
      tracks_limit: 8,
      albums: [],
      albums_limit: 28,
      albums_offset: 0,
      albums_next: '',
      albums_loadMore: false
    }
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
        time_range:'short_term',
        limit: this.tracks_limit,
        offset: 0
      }
      const res = (await getUserTopSongs(params)).data.items
      this.tracks = res
    },
    async getPlaylists() {
      const params = {
        limit: this.playlists_limit,
        offset: 0
      }
      const res = (await getFeaturedPlaylists(params)).data.playlists
      this.playlists = res.items
      this.playlists_total = res.total
    },
    async getUserTopArtists() {
      const params = {
        time_range:'short_term',
        limit: this.artists_limit,
        offset: 0
      }
      const res = (await getUserTopArtists(params)).data.items
      this.artists = res
    },
    async getNewReleases() {
      if (!this.albums_loadMore && this.albums_next !== null) {
        let res
        this.albums_loadMore = true

        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await getNewReleases(params)).data.albums
        } else {
          let path = this.albums_next
          res = (await getNextNewReleases(path.slice(path.indexOf('?') + 1))).data.albums
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))
        this.albums = [...oldVals, ...newVals]

        this.albums_next = res.next

        this.albums_loadMore = false
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 1.6rem;

  &__top-songs {
    &__content {
      padding: 1.6rem;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(20%, 100%), 1fr));
      gap: calc($gutter * 2);
    }
  }

  &__featured-playlists,
  &__top-artists,
  &__new-releases {
    &__content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
    }
  }
}
</style>
