<template>
  <MyOverlayScrollbars os-element="main">
    <div class="artist-all-singles">
      <div class="artist-all-singles__content" v-if="!loading">
        <TitleSimple :title="'Singles'" />
        <div class="artist-all-singles__content__results">
          <AlbumCard v-for="item in singles" :key="item.id" :item="item" />
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
import { getSingles } from '@/api/artist'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'ArtistAllSingles',
  components: {
    MyOverlayScrollbars,
    AlbumCard,
    TitleSimple,
    AlbumCard,
    Loading
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
  min-height: $height-content;
  height: $height-content;

  &__content {
    padding: 2.4rem;

    &__results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
    }
  }
}
</style>
