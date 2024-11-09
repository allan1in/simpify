<template>
  <template v-if="!loading_skeleton">
    <div class="featured-playlists-container">
      <TitleShowAll title="Featured Playlists" />
      <div class="featured-playlists-container__content">
        <CardPlaylist v-for="item in playlists" :item="item" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="featured-playlists-container">
      <TitleShowAll :loading="loading_skeleton" />
      <div class="featured-playlists-container__content">
        <CardPlaylist v-for="i in playlists_limit" :loading="loading_skeleton" />
      </div>
    </div>
  </template>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'
import { getFeaturedPlaylists, getNextFeaturedPlaylists } from '@/api/meta/browse'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'FeaturedPlaylists',
  components: {
    TitleShowAll,
    CardPlaylist
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  data() {
    return {
      playlists: [],
      playlists_limit: 48,
      playlists_offset: 0,
      playlists_next: '',
      loading_more: false,
      loading_skeleton: true
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
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getPlaylists()
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
.featured-playlists-container {
  padding: 1.6rem;

  &__content {
    @include gridCards;
  }
}
</style>
