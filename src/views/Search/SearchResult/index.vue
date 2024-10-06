<template>
  <MyOverlayScrollbars os-class="search-container" os-element="main">
    <TopBar />
    <section class="search-container__search-content">
      <RouterView />
    </section>
  </MyOverlayScrollbars>
</template>

<script>
import TopBar from '../TopBar.vue'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'

export default {
  name: 'SearchResult',
  components: {
    TopBar,
    MyOverlayScrollbars
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  height: inherit;

  &__search-content {
    padding: 2.4rem;
    height: calc(100% - 5.6rem);
  }
}
</style>
