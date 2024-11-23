<template>
  <div class="my-library__container__content__playlists">
    <CardPlaylistHorizontal v-for="item in playlists" :loading="loading_skeleton" :item="item" />
  </div>
</template>

<script>
import { getCurrentUserPlaylists, getNextCurrentUserPlaylists } from '@/api/meta/user'
import CardPlaylistHorizontal from '@/components/CardPlaylistHorizontal/index.vue'

export default {
  name: 'Playlists',
  inject: ['bottom'],
  data() {
    return {
      loading_skeleton: true,
      playlists: [],
      playlists_limit: 20,
      playlists_offset: 0,
      playlists_next: ''
    }
  },
  components: {
    CardPlaylistHorizontal
  },
  methods: {
    async getAll() {
      await this.getCurrentUserPlaylists()

      this.loading_skeleton = false
    },
    async getCurrentUserPlaylists() {
      if (!this.loading_more && this.playlists_next !== null) {
        this.loading_more = true
        let res

        if (this.playlists_next === '') {
          const params = {
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = await getCurrentUserPlaylists(params)
        } else {
          let path = this.playlists_next
          res = await getNextCurrentUserPlaylists(path.slice(path.indexOf('?') + 1))
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
    bottom: {
      handler(newVal, oldVal) {
        if (newVal <= 0) {
          this.getCurrentUserPlaylists()
        }
      },
      immediate: true
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped></style>
