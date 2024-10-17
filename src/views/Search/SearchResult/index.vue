<template>
  <MyOverlayScrollbars os-element="main">
    <div class="search-container">
      <TopBar :showTags="showTags" />
      <section class="search-container__search-content">
        <RouterView :showTypes="showTags" />
      </section>
    </div>
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
        artist: undefined,
        playlist: undefined
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
        type: 'album,artist,track,playlist',
        limit: 1,
        offset: 0
      }
      const res = (await search(params)).data
      this.showTags.album = res.albums.total === 0 ? false : true
      this.showTags.artist = res.artists.total === 0 ? false : true
      this.showTags.track = res.tracks.total === 0 ? false : true
      this.showTags.playlist = res.playlists.total === 0 ? false : true
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
  min-height: 100%;
  height: 100%;

  &__search-content {
    min-height: calc($height-content - $height-nav-secondary);
  }
}
</style>
