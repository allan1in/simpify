<template>
  <MyOverlayScrollbars os-element="main" @load-more="toggleLoadMore">
    <div class="search-container">
      <TopBar />
      <section class="search-container__search-content">
        <RouterView :load-more="loadMore" @load-more-finish="toggleLoadMore" />
      </section>
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import TopBar from './TopBar/index.vue'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'

export default {
  name: 'SearchResult',
  data() {
    return {
      showTags: {
        track: undefined,
        album: undefined,
        artist: undefined,
        playlist: undefined
      },
      loadMore: false
    }
  },
  components: {
    TopBar,
    MyOverlayScrollbars
  },
  methods: {
    toggleLoadMore(trigger = true) {
      this.loadMore = trigger
    }
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
