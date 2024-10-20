<template>
  <Container :loading>
    <div class="dashboard-container">
      <div class="dashboard-container__top-songs">
        <TitleSimple title="Top Songs" />
        <div class="dashboard-container__top-songs__content">
          <CardHorizontal v-for="item in tracks" :item="item" />
        </div>
      </div>
      <div class="dashboard-container__featured-playlists">
        <TitleShowAll router-name="FeaturedPlaylists" title="Featured Playlists" />
        <div class="dashboard-container__featured-playlists__content">
          <PlaylistCard v-for="item in playlists" :item="item" />
        </div>
      </div>
      <div class="dashboard-container__top-artists">
        <TitleSimple title="Top Artists" />
        <div class="dashboard-container__top-artists__content">
          <ArtistCard v-for="item in artists" :item="item" />
        </div>
      </div>
      <div class="dashboard-container__new-releases">
        <TitleSimple title="New Releases" />
        <div class="dashboard-container__new-releases__content">
          <AlbumCard v-for="item in albums" :item="item" />
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import AlbumCard from '@/components/CardAlbum/index.vue'
import CardHorizontal from '@/components/CardHorizontal/index.vue'
import { getFeaturedPlaylists } from '@/api/browse'
import { getUserTopArtists, getUserTopSongs } from '@/api/user'
import { getNewReleases } from '@/api/album'

export default {
  name: 'Dashboard',
  components: {
    Container,
    TitleSimple,
    PlaylistCard,
    TitleShowAll,
    ArtistCard,
    AlbumCard,
    CardHorizontal
  },
  data() {
    return {
      loading: true,
      playlists: {},
      artists: {},
      albums: {},
      tracks: {}
    }
  },
  methods: {
    async getAll() {
      await this.getUserTopSongs()
      await this.getPlalists()
      await this.getUserTopArtists()
      await this.getNewReleases()
      this.loading = false
    },
    async getUserTopSongs() {
      const params = {
        limit: 8,
        offset: 0
      }
      const res = (await getUserTopSongs(params)).data.items
      this.tracks = res
    },
    async getPlalists() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getFeaturedPlaylists(params)).data.playlists.items
      this.playlists = res
    },
    async getUserTopArtists() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getUserTopArtists(params)).data.items
      this.artists = res
    },
    async getNewReleases() {
      const params = {
        limit: 28,
        offset: 0
      }
      const res = (await getNewReleases(params)).data.albums.items
      this.albums = res
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 2.4rem;

  &__top-songs {
    &__content {
      padding: 1.6rem 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(30rem, 100%), 1fr));
      gap: $gutter;
    }
  }

  &__featured-playlists,
  &__top-artists,
  &__new-releases {
    &__content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
    }
  }
}
</style>
