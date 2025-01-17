<template>
  <template v-if="active">
    <template v-if="!loading_skeleton">
      <div class="my-library__container__content__liked-songs">
        <TransitionGroup name="list">
          <CardTrackLibrary
            v-for="(item, index) in songs"
            :key="item.track.id"
            :item="item.track"
            :index
            :uris
          />
        </TransitionGroup>
      </div>
    </template>
    <template v-else>
      <div class="my-library__container__content__liked-songs">
        <CardTrackLibrary v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </template>
  </template>
</template>

<script>
import { getNextUserlikedSongs, getUserlikedSongs } from '@/api/meta/user'
import CardTrackLibrary from '@/components/CardTrackLibrary/index.vue'
import { useLibraryStore } from '@/stores/library'
import { mapActions, mapState } from 'pinia'

export default {
  name: 'Songs',
  inject: ['bottom'],
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tracks_limit: 20,
      tracks_offset: 0,
      tracks_next: '',
      loading_skeleton: true
    }
  },
  components: {
    CardTrackLibrary
  },
  computed: {
    uris() {
      let uris = []
      this.songs.forEach((item) => {
        uris.push(item.track.uri)
      })
      return uris
    },
    ...mapState(useLibraryStore, ['songs'])
  },
  methods: {
    ...mapActions(useLibraryStore, ['addSongs']),
    async getAll() {
      await this.getUserlikedSongs()

      this.loading_skeleton = false
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

        let newVals = res.items.filter((item) => item !== null)
        this.addSongs(newVals)
        this.tracks_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom: {
      handler(newVal) {
        if (newVal <= 0 && this.active) {
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

<style lang="scss" scoped>
.my-library__container__content__liked-songs {
  position: relative;
}
</style>
