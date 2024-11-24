<template>
  <div class="my-library__container__content__liked-songs">
    <CardTrackLibrary v-for="(item, index) in tracks" :item="item.track" :index :uris />
  </div>
</template>

<script>
import { getNextUserlikedSongs, getUserlikedSongs } from '@/api/meta/user'
import CardTrackLibrary from '@/components/CardTrackLibrary/index.vue'

export default {
  name: 'LikedSongs',
  inject: ['bottom'],
  data() {
    return {
      tracks: [],
      tracks_limit: 20,
      tracks_offset: 0,
      tracks_next: ''
    }
  },
  components: {
    CardTrackLibrary
  },
  computed: {
    uris() {
      let uris = []
      this.tracks.forEach((item) => {
        uris.push(item.track.uri)
      })
      return uris
    }
  },
  methods: {
    async getAll() {
      await this.getUserlikedSongs()
    },
    async getUserlikedSongs() {
      if (!this.loading_more && this.tracks_next !== null) {
        this.loading_more = true
        let res

        if (this.tracks_next === '') {
          const params = {
            limit: this.tracks_limit,
            offset: this.tracks_offset
          }
          res = await getUserlikedSongs(params)
        } else {
          let path = this.tracks_next
          res = await getNextUserlikedSongs(path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.tracks))
        this.tracks = [...oldVals, ...newVals]
        this.tracks_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom: {
      handler(newVal, oldVal) {
        if (newVal <= 0) {
          this.getUserlikedSongs()
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
