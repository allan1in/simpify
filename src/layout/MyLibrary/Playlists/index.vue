<template>
  <div class="my-library__container__content__playlists">
    <CardPlaylistLibrary v-for="item in playlists" :item />
  </div>
</template>

<script>
import { getCurrentUserPlaylists, getNextCurrentUserPlaylists } from '@/api/meta/user'
import CardPlaylistLibrary from '@/components/CardPlaylistLibrary/index.vue'

export default {
  name: 'Playlists',
  inject: ['bottom'],
  data() {
    return {
      playlists: [],
      playlists_limit: 20,
      playlists_offset: 0,
      playlists_next: ''
    }
  },
  components: {
    CardPlaylistLibrary
  },
  methods: {
    async getAll() {
      await this.getCurrentUserPlaylists()
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

        let newVals = res.items.filter((item) => item !== null)
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
