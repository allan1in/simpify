<template>
  <main class="album-container">
    <div class="album-container__msg">
      <h1 class="album-container__msg__total">{{ albums.total }} Albums</h1>
    </div>
    <div class="album-container__results">
      <AlbumCard v-for="item in albums.items" :key="item.id" :item="item" />
    </div>
  </main>
</template>

<script>
import AlbumCard from './AlbumCard.vue'
import albums from './albums.json'

export default {
  name: 'GetAlbums',
  data() {
    return {
      albums
    }
  },
  components: {
    AlbumCard
  }
}
</script>

<style lang="scss" scoped>
.album-container {
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
