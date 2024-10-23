<template>
  <main v-if="!loading" class="track-container">
    <div class="track-container__content">
      <TrackListHeader />
      <TrackCard v-for="(item, index) in tracks" :key="index" :item="item" :index="index" />
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { searchTracks, searchNextPage } from '@/api/search'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetTracks',
  components: {
    TrackCard,
    TrackListHeader,
    Loading
  },
  data() {
    return {
      tracks: [],
      loading: true,
      loading_limit: 14,
      loading_offset: 0,
      loading_next: ''
    }
  },
  // https://danyal.dk/blog/2022/12/05/vuejs-3-emit-the-warning-extraneous-non-emits-event-listeners/
  emits: ['loadMoreFinish'],
  props: {
    loadMore: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  methods: {
    async getTracks() {
      if (this.loading_next != null) {
        let res

        if (this.loading_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.loading_limit,
            offset: this.loading_offset
          }
          res = (await searchTracks(params)).data.tracks
        } else {
          let path = this.loading_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).data.tracks
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.tracks))

        this.tracks = [...oldVals, ...newVals]
        this.loading_next = res.next

        this.$emit('loadMoreFinish', false)
        this.loading = false
      }
    }
  },
  created() {
    this.getTracks()
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getTracks()
      }
    }
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
