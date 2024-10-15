<template>
  <main v-if="!loading" class="track-container">
    <TitleSimple :title="'Tracks'">
      <template #before-title>{{ tracks.total + ' ' }}</template>
    </TitleSimple>
    <TrackListHeader />
    <TrackCard v-for="(item, index) in tracks.items" :key="index" :item="item" :index="index" />
  </main>
  <Loading :loading />
</template>

<script>
import TrackCard from '@/components/TrackCard/index.vue'
import TrackListHeader from '@/components/TrackListHeader/index.vue'
import { searchTracks } from '@/api/search'
import TitleSimple from '@/components/TitleSimple/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetTracks',
  props: ['showTypes'],
  components: {
    TrackCard,
    TrackListHeader,
    TitleSimple,
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
        limit: 28,
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
  min-height: 100%;
  height: 100%;
  padding: 2.4rem;

  &__msg {
    padding-bottom: 2.4rem;

    &__total {
      @include titleStyles;
    }
  }
}
</style>
