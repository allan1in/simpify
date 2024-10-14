<template>
  <MyOverlayScrollbars os-class="search-container" os-element="main">
    <TopBar />
    <section class="search-container__search-content">
      <RouterView />
    </section>
  </MyOverlayScrollbars>
</template>

<script>
import { search } from '@/api/search'
import TopBar from './TopBar/index.vue'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import { debounce } from '@/utils/debounce'
import { mapWritableState } from 'pinia'
import { useSearchStore } from '@/stores/search'

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
  computed: {
    ...mapWritableState(useSearchStore, ['showAlbums', 'showArtists', 'showTracks', 'checkLoading'])
  },
  methods: {
    // If there is no data of this type, hide the tag
    checkHasResults: debounce(async function () {
      if (this.$route.params.inputContent) {
        const params = {
          q: this.$route.params.inputContent,
          type: 'album,artist,track',
          limit: 1,
          offset: 0
        }
        const res = (await search(params)).data
        this.showAlbums = res.albums.total === 0 ? false : true
        this.showArtists = res.artists.total === 0 ? false : true
        this.showTracks = res.tracks.total === 0 ? false : true
        this.checkLoading = false
      }
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
