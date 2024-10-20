<template>
  <main v-if="!loading" class="track-container">
    <div class="track-container__content">
      <TitleSimple :title="'Tracks'">
        <template #before-title>{{ tracks.total + ' ' }}</template>
      </TitleSimple>
      <TrackListHeader />
      <TrackCard v-for="(item, index) in tracks.items" :key="index" :item="item" :index="index" />
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { searchTracks } from '@/api/search'
import TitleSimple from '@/components/TitleSimple/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetTracks',
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
  min-height: inherit;

  &__content {
    padding: 2.4rem;

    &__msg {
      padding-bottom: 2.4rem;

      &__total {
        @include titleStyles;
      }
    }
  }
}
</style>
