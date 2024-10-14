<template>
  <MyOverlayScrollbars v-if="!loading" :os-class="'artist-all-singles'" :os-element="'main'">
    <TitleSimple :title="'Singles'" />
    <div class="artist-all-singles__results">
      <AlbumCard v-for="item in singles" :key="item.id" :item="item" />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import AlbumCard from '@/components/AlbumCard/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getSingles } from '@/api/artists'

export default {
  name: 'ArtistAllSingles',
  components: {
    MyOverlayScrollbars,
    AlbumCard,
    TitleSimple,
    AlbumCard
  },
  data() {
    return {
      singles: {},
      loading: true
    }
  },
  methods: {
    async getSingles() {
      const params = {
        limit: 28,
        offset: 0
      }
      const res = (await getSingles(this.$route.params.artistId, params)).data.items
      this.singles = res
      this.loading = false
    }
  },
  created() {
    this.getSingles()
  }
}
</script>

<style lang="scss" scoped>
.artist-all-singles {
  height: inherit;
  padding: 2.4rem;

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
