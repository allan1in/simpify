<template>
  <main v-if="!loading" class="track-container">
    <div class="track-container__msg">
      <h1 class="track-container__msg__total">{{ tracks.total + ' Songs' }}</h1>
    </div>
    <TrackListHeader />
    <TrackCard v-for="(item, index) in tracks.items" :key="index" :item="item" :index="index" />
  </main>
  <Loading :loading="loading" />
</template>

<script>
import TrackCard from './TrackCard.vue'
import TrackListHeader from './TrackListHeader.vue'
import { searchTracks } from '@/api/search'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetTracks',
  props: ['showTypes'],
  components: {
    TrackCard,
    TrackListHeader,
    Loading
  },
  data() {
    return {
      tracks: {},
      loading: true
    }
  },
  methods: {
    async getTracks() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 30,
        offset: 0
      }
      const res = (await searchTracks(params)).data.tracks
      this.tracks = res
      this.loading = false
    }
  },
  mounted() {
    this.getTracks()
  }
}
</script>

<style lang="scss" scoped>
.track-container {
  &__msg {
    padding-bottom: 2.4rem;

    &__total {
      font-family: $font-family-title;
      font-size: 2.4rem;
    }
  }
}
</style>
