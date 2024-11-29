<template>
  <template v-if="active">
    <template v-if="!loading_skeleton">
      <div class="my-library__container__content__playlists">
        <CardPlaylistLibrary v-for="item in playlists" :item />
      </div>
    </template>
    <template v-else>
      <div class="my-library__container__content__playlists">
        <CardPlaylistLibrary v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </template>
  </template>
</template>
<script>
import { getCurrentUserPlaylists, getNextCurrentUserPlaylists } from '@/api/meta/user'
import CardPlaylistLibrary from '@/components/CardPlaylistLibrary/index.vue'

export default {
  name: 'Playlists',
  inject: ['bottom'],
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      playlists: [],
      playlists_limit: 20,
      playlists_offset: 0,
      playlists_next: '',
      loading_skeleton: true
    }
  },
  components: {
    CardPlaylistLibrary
  },
  methods: {
    reset() {
      this.playlists = []
      this.playlists_limit = 20
      this.playlists_offset = 0
      this.playlists_next = ''
      this.loading_skeleton = true
    },
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
    },
    active: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.reset()
          this.getAll()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
