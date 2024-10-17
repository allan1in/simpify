<template>
  <MyOverlayScrollbars os-element="main">
    <div class="artist-all-albums">
      <div class="artist-all-albums__content" v-if="!loading">
        <TitleSimple :title="'Albums'" />
        <div class="artist-all-albums__content__results">
          <AlbumCard v-for="item in albums" :key="item.id" :item="item" />
        </div>
      </div>
      <Loading :loading />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import AlbumCard from '@/components/AlbumCard/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getAlbums } from '@/api/artist'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'ArtistAllAlbums',
  components: {
    MyOverlayScrollbars,
    AlbumCard,
    TitleSimple,
    AlbumCard,
    Loading
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
  min-height: $height-content;
  height: $height-content;

  &__content {
    padding: 2.4rem;

    &__results {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
  }
}
</style>
