<template>
  <template v-if="!loading_skeleton">
    <main class="track-container">
      <div class="track-container__content">
        <TrackListHeader />
        <TrackCard
          v-for="(item, index) in tracks"
          :key="index"
          :item="item"
          :index="index"
          :uris="uris"
        />
      </div>
    </main>
  </template>
  <template v-else>
    <main class="track-container">
      <div class="track-container__content">
        <TrackListHeader :loading="loading_skeleton" />
        <TrackCard v-for="i in tracks_limit" :loading="loading_skeleton" />
      </div>
    </main>
  </template>
</template>

<script>
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { searchTracks, searchNextPage } from '@/api/meta/search'
import { useAppStore } from '@/stores/app'
import { mapWritableState } from 'pinia'

export default {
  name: 'GetTracks',
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
      loadingMore: false,
      uris: [],
      loading_skeleton: true
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getTracks()

      this.loading_skeleton = false
    },
    async getTracks() {
      if (!this.loadingMore && this.tracks_next != null) {
        this.loadingMore = true
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

        let newVals = res.items
        newVals.forEach((item) => {
          this.uris.push(item.uri)
        })
        let oldVals = JSON.parse(JSON.stringify(this.tracks))

        this.tracks = [...oldVals, ...newVals]
        this.tracks_next = res.next

        this.loadingMore = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getTracks()
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
.track-container {
  min-height: inherit;

  &__content {
    padding: 1.6rem;

    &__msg {
      padding-bottom: 1.6rem;

      &__total {
        @include titleStyles;
      }
    }
  }
}
</style>
