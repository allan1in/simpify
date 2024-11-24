<template>
  <div class="my-library__container__content__albums">
    <CardAlbumLibrary v-for="item in albums" :item="item.album" />
  </div>
</template>

<script>
import { getCurrentUserAlbums, getNextCurrentUserAlbums } from '@/api/meta/user'
import CardAlbumLibrary from '@/components/CardAlbumLibrary/index.vue'

export default {
  name: 'Albums',
  inject: ['bottom'],
  data() {
    return {
      albums: [],
      albums_limit: 20,
      albums_offset: 0,
      albums_next: ''
    }
  },
  components: {
    CardAlbumLibrary
  },
  methods: {
    async getAll() {
      await this.getCurrentUserAlbums()
    },
    async getCurrentUserAlbums() {
      if (!this.loading_more && this.albums_next !== null) {
        this.loading_more = true
        let res

        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = await getCurrentUserAlbums(params)
        } else {
          let path = this.albums_next
          res = await getNextCurrentUserAlbums(path.slice(path.indexOf('?') + 1))
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
    bottom: {
      handler(newVal, oldVal) {
        if (newVal <= 0) {
          this.getCurrentUserAlbums()
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
