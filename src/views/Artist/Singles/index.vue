<template>
  <Container :loading>
    <div class="artist-all-singles">
      <TitleSimple :title="'Singles'" />
      <div class="artist-all-singles__results">
        <AlbumCard v-for="item in singles" :key="item.id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getSingles } from '@/api/artist'
import Container from '@/components/Container/index.vue'

export default {
  name: 'ArtistAllSingles',
  components: {
    AlbumCard,
    TitleSimple,
    AlbumCard,
    Container
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
  padding: 1.6rem;

  &__results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  }
}
</style>
