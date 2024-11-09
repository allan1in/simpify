<template>
  <div class="dashboard-container" v-if="!loading">
    <template v-if="!loading_skeleton">
      <div class="dashboard-container__featured-playlists" v-if="playlists.length !== 0">
        <TitleShowAll
          :router-name="playlists_total > playlists_limit ? 'FeaturedPlaylists' : ''"
          title="Featured Playlists"
        />
        <div class="dashboard-container__featured-playlists__content">
          <CardHorizontal v-for="item in playlists" :item="item" />
        </div>
      </div>

      <div class="dashboard-container__new-releases" v-if="albums.length !== 0">
        <TitleShowAll title="New Releases" />
        <div class="dashboard-container__new-releases__content">
          <CardAlbum v-for="item in albums" :item="item" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="dashboard-container__featured-playlists">
        <TitleShowAll :loading="loading_skeleton" />
        <div class="dashboard-container__featured-playlists__content">
          <CardHorizontal v-for="i in playlists_limit" :loading="loading_skeleton" />
        </div>
      </div>

      <div class="dashboard-container__new-releases">
        <TitleShowAll :loading="loading_skeleton" />
        <div class="dashboard-container__new-releases__content">
          <CardAlbum v-for="i in albums_limit" :loading="loading_skeleton" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import CardAlbum from '@/components/CardAlbum/index.vue'
import CardHorizontal from '@/components/CardHorizontal/index.vue'
import { getFeaturedPlaylists } from '@/api/meta/browse'
import { getNewReleases, getNextNewReleases } from '@/api/meta/album'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'Dashboard',
  components: {
    PlaylistCard,
    TitleShowAll,
    CardAlbum,
    CardHorizontal,
    Skeleton
  },
  data() {
    return {
      playlists: [],
      playlists_total: 0,
      playlists_limit: 8,
      albums: [],
      albums_limit: 48,
      albums_offset: 0,
      albums_next: '',
      loading_more: false,
      loading_skeleton: true
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getPlaylists()
      await this.getNewReleases()

      this.loading_skeleton = false
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
    async getNewReleases() {
      if (!this.loading_more && this.albums_next !== null) {
        this.loading_more = true
        let res

        // First time load data
        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await getNewReleases(params)).albums
        } else {
          if (this.loading_skeleton) {
            return
          }
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
  mounted() {
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 1.6rem;

  &__featured-playlists {
    &__content {
      padding: 1.6rem;
      gap: $gutter-2x;

      @include gridCardsExtraLess;
    }
  }

  &__new-releases {
    &__content {
      @include gridCards;
    }
  }
}
</style>
