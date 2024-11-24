<template>
  <div class="my-library__container__content__artists">
    <CardArtistLibrary v-for="item in artists" :item="item" />
  </div>
</template>

<script>
import { getCurrentUserArtists, getNextCurrentUserArtists } from '@/api/meta/user'
import CardArtistLibrary from '@/components/CardArtistLibrary/index.vue'

export default {
  name: 'Artists',
  inject: ['bottom'],
  data() {
    return {
      artists: [],
      artists_limit: 20,
      artists_next: ''
    }
  },
  components: {
    CardArtistLibrary
  },
  methods: {
    async getAll() {
      await this.getCurrentUserArtists()
    },
    async getCurrentUserArtists() {
      if (!this.loading_more && this.artists_next !== null) {
        this.loading_more = true
        let res

        if (this.artists_next === '') {
          const params = {
            limit: this.artists_limit
          }
          res = await getCurrentUserArtists(params)
        } else {
          let path = this.artists_next
          res = await getNextCurrentUserArtists(path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.artists.items
        let oldVals = JSON.parse(JSON.stringify(this.artists))
        this.artists = [...oldVals, ...newVals]
        this.artists_next = res.artists.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom: {
      handler(newVal, oldVal) {
        if (newVal <= 0) {
          this.getCurrentUserArtists()
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
