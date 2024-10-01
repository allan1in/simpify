<template>
  <main class="search-container">
    <TopBar />
    <section class="search-container__search-content">
      <RouterView />
    </section>
  </main>
</template>

<script>
import TopBar from '../TopBar.vue'

export default {
  name: 'SearchResult',
  components: {
    TopBar
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  height: inherit;

  &__search-content {
    padding: 0 2.4rem;
    height: calc(100% - 5.6rem);
    overflow: auto;
  }
}
</style>
