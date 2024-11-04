<template>
  <main v-if="!loading" class="track-container">
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
      loading_limit: 20,
      loading_offset: 0,
      loading_next: '',
      loadingMore: false,
      uris: []
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getTracks()
      this.loading = false
    },
    async getTracks() {
      if (!this.loadingMore && this.loading_next != null) {
        this.loadingMore = true
        let res

        if (this.loading_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.loading_limit,
            offset: this.loading_offset
          }
          res = (await searchTracks(params)).tracks
        } else {
          let path = this.loading_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).tracks
        }

        let newVals = res.items
        newVals.forEach((item) => {
          this.uris.push(item.uri)
        })
        let oldVals = JSON.parse(JSON.stringify(this.tracks))

        this.tracks = [...oldVals, ...newVals]
        this.loading_next = res.next

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
