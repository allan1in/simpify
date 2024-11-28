<template>
  <template v-if="!loading_skeleton">
    <main class="track-container">
      <div class="track-container__results">
        <TrackListHeader />
        <TrackCard v-for="(item, index) in tracks" :key="item.id" :item="item" :index="index" :uris="uris" />
      </div>
    </main>
  </template>
  <template v-else>
    <main class="track-container">
      <div class="track-container__results">
        <TrackListHeader :loading="loading_skeleton" />
        <TrackCard v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </main>
  </template>
</template>

<script>
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { searchTracks, searchNextPage } from '@/api/meta/search'

export default {
  name: 'GetTracks',
  inject: ['bottom'],
  components: {
    TrackCard,
    TrackListHeader
  },
  data() {
    return {
      tracks: [],
      tracks_limit: 24,
      tracks_offset: 0,
      tracks_next: '',
      uris: [],
      loading_skeleton: true,
      loading_more: false
    }
  },
  methods: {
    async getAll() {
      await this.getTracks()

      this.loading_skeleton = false
    },
    async getTracks() {
      if (!this.loading_more && this.tracks_next != null) {
        this.loading_more = true
        let res

        if (this.tracks_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.tracks_limit,
            offset: this.tracks_offset
          }
          res = (await searchTracks(params)).tracks
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.tracks_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).tracks
        }

        let newVals = res.items.filter(item => item !== null)
        newVals.forEach((item) => {
          this.uris.push(item.uri)
        })
        let oldVals = JSON.parse(JSON.stringify(this.tracks))

        this.tracks = [...oldVals, ...newVals]
        this.tracks_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal, oldVal) {
      if (newVal <= 0) {
        this.getTracks()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.track-container {
  min-height: inherit;

  &__results {
    padding: $gutter-1-5x;
    margin: 0 $gutter-1-5x;

    &__msg {
      padding-bottom: $gutter-1-5x;

      &__total {
        @include titleStyles;
      }
    }
  }
}
</style>
