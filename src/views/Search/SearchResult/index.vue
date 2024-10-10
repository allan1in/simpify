<template>
  <MyOverlayScrollbars os-class="search-container" os-element="main">
    <TopBar :showTags="showTags" />
    <section class="search-container__search-content">
      <RouterView :showTypes="showTags" />
    </section>
  </MyOverlayScrollbars>
</template>

<script>
import { search } from '@/api/search'
import TopBar from './TopBar/index.vue'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import { debounce } from '@/utils/debounce'

export default {
  name: 'SearchResult',
  data() {
    return {
      showTags: {
        track: undefined,
        album: undefined,
        artist: undefined
      }
    }
  },
  components: {
    TopBar,
    MyOverlayScrollbars
  },
  methods: {
    // If there is no data of this type, hide the tag
    checkHasResults: debounce(async function () {
      const params = {
        q: this.$route.params.inputContent,
        type: 'album,artist,track',
        limit: 1,
        offset: 0
      }
      const res = (await search(params)).data
      this.showTags.album = res.albums.total === 0 ? false : true
      this.showTags.artist = res.artists.total === 0 ? false : true
      this.showTags.track = res.tracks.total === 0 ? false : true
    })
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.checkHasResults()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  height: inherit;

  &__search-content {
    padding: 2.4rem;
    height: inherit;
  }
}
</style>
