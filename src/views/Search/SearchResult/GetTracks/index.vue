<template>
  <main class="track-container">
    <div class="track-container__msg">
      <h1 class="track-container__msg__total">{{ tracks.total + ' Songs' }}</h1>
    </div>
    <TrackListHeader />
    <TrackCard v-for="(item, index) in tracks.items" :key="index" :item="item" :index="index" />
  </main>
</template>

<script>
import tracks from './tracks.json'
import TrackCard from './TrackCard.vue'
import TrackListHeader from './TrackListHeader.vue'

export default {
  name: 'GetTracks',
  components: {
    TrackCard,
    TrackListHeader
  },
  data() {
    return {
      tracks
    }
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
