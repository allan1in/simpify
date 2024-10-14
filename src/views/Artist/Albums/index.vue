<template>
  <MyOverlayScrollbars :os-class="'artist-all-albums'" :os-element="'main'">
    <div>Albums</div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import AlbumCard from '@/components/AlbumCard/index.vue'

export default {
  name: 'ArtistAllAlbums',
  components: {
    MyOverlayScrollbars,
    AlbumCard
  }
}
</script>

<style lang="scss" scoped></style>
