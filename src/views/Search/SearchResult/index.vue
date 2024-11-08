<template>
  <div class="search-container">
    <TopBar />
    <section class="search-container__search-content">
      <RouterView />
    </section>
  </div>
</template>

<script>
import TopBar from './TopBar/index.vue'

export default {
  name: 'SearchResult',
  data() {
    return {
      showTags: {
        track: undefined,
        album: undefined,
        artist: undefined,
        playlist: undefined
      }
    }
  },
  components: {
    TopBar
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  &__search-content {
    min-height: calc($height-content - $height-nav-secondary);
  }
}
</style>
