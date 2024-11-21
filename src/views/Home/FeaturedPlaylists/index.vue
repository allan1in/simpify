<template>
  <template v-if="!loading_skeleton">
    <div class="featured-playlists-container">
      <TitleShowAll title="Featured Playlists" />
      <div class="featured-playlists-container__content">
        <CardPlaylist v-for="item in playlists" :key="item.id" :item="item" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="featured-playlists-container">
      <TitleShowAll :loading="loading_skeleton" />
      <div class="featured-playlists-container__content">
        <CardPlaylist v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </div>
  </template>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'
import { getFeaturedPlaylists, getNextFeaturedPlaylists } from '@/api/meta/browse'

export default {
  name: 'FeaturedPlaylists',
  inject: ['bottom'],
  components: {
    TitleShowAll,
    CardPlaylist
  },
  data() {
    return {
      playlists: [],
      playlists_limit: 48,
      playlists_offset: 0,
      playlists_next: '',
      loading_skeleton: true,
      loading_more: false
    }
  },
  methods: {
    async getAll() {
      await this.getPlaylists()

      this.loading_skeleton = false
    },
    async getPlaylists() {
      if (!this.loading_more && this.playlists_next !== null) {
        this.loading_more = true
        let res

        if (this.playlists_next === '') {
          const params = {
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = (await getFeaturedPlaylists(params)).playlists
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.playlists_next
          res = (await getNextFeaturedPlaylists(path.slice(path.indexOf('?') + 1))).playlists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]

        this.playlists_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal, oldVal) {
      if (newVal <= 0) {
        this.getAll()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.featured-playlists-container {
  padding: $gutter-1-5x;

  &__content {
    @include gridCards;
  }
}
</style>
