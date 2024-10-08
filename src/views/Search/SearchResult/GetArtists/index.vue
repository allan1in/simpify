<template>
  <main class="artist-container">
    <div class="artist-container__msg">
      <h1 class="artist-container__msg__total">{{ artists.total }} Artists</h1>
    </div>
    <div class="artist-container__results">
      <ArtistCard v-for="item in artists.items" :key="item.id" :item="item" />
    </div>
  </main>
</template>

<script>
import artists from './artists.json'
import ArtistCard from './ArtistCard.vue'

export default {
  name: 'GetArtists',
  components: {
    ArtistCard
  },
  data() {
    return {
      artists
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  &__msg {
    padding-bottom: 1.6rem;

    &__total {
      font-family: $font-family-title;
      font-size: 2.4rem;
    }
  }

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
