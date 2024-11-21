<template>
  <div class="dashboard-container" www90>
    <template v-if="!loading_skeleton">
      <div class="dashboard-container__featured-playlists" v-if="playlists.length !== 0">
        <TitleShowAll
          :router-name="playlists_total > playlists_limit ? 'FeaturedPlaylists' : ''"
          :title="$t('home.featured_playlists')"
        />
        <div class="dashboard-container__featured-playlists__content">
          <CardHorizontal v-for="item in playlists" :key="item.id" :item="item" />
        </div>
      </div>

      <div class="dashboard-container__new-releases" v-if="albums.length !== 0">
        <TitleShowAll :title="$t('home.new_releases')" />
        <div class="dashboard-container__new-releases__content">
          <CardAlbum v-for="item in albums" :key="item.id" :item="item" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="dashboard-container__featured-playlists">
        <TitleShowAll :loading="loading_skeleton" />
        <div class="dashboard-container__featured-playlists__content">
          <CardHorizontal v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>

      <div class="dashboard-container__new-releases">
        <TitleShowAll :loading="loading_skeleton" />
        <div class="dashboard-container__new-releases__content">
          <CardAlbum v-for="i in albums_limit" :key="i" :loading="loading_skeleton" />
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
import Skeleton from '@/components/Skeleton/index.vue'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Dashboard',
  inject: ['bottom'],
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
      loading_skeleton: true,
      loading_more: false
    }
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

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal, oldVal) {
      if (newVal <= 0) {
        this.getNewReleases()
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
  padding: $gutter-1-5x;

  &__featured-playlists {
    &__content {
      padding: $gutter-1-5x;
      gap: $gutter-1-5x;

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
