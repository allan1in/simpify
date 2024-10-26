<template>
  <div class="search-container">
    <TopBar />
    <section class="search-container__search-content">
      <RouterView />
    </section>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import TopBar from './TopBar/index.vue'
import { useAppStore } from '@/stores/app'

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
  computed: {
    ...mapWritableState(useAppStore, ['loading'])
  },
  components: {
    TopBar
  },
  beforeUnmount() {
    this.loading = true
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
