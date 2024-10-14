<template>
  <MyOverlayScrollbars v-if="!loading" :os-class="'artist-all-albums'" :os-element="'main'">
    <TitleSimple :title="'Albums'" />
    <div class="artist-all-albums__results">
      <AlbumCard v-for="item in albums" :key="item.id" :item="item" />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import AlbumCard from '@/components/AlbumCard/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getAlbums } from '@/api/artists'

export default {
  name: 'ArtistAllAlbums',
  components: {
    MyOverlayScrollbars,
    AlbumCard,
    TitleSimple,
    AlbumCard
  },
  data() {
    return {
      albums: {},
      loading: true
    }
  },
  methods: {
    async getAlbums() {
      const params = {
        limit: 28,
        offset: 0
      }
      const res = (await getAlbums(this.$route.params.artistId, params)).data.items
      this.albums = res
      this.loading = false
    }
  },
  created() {
    this.getAlbums()
  }
}
</script>

<style lang="scss" scoped>
.artist-all-albums {
  height: inherit;
  padding: 2.4rem;

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
