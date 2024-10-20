<template>
  <Container :loading>
    <div class="artist-all-albums">
      <TitleSimple :title="'Albums'" />
      <div class="artist-all-albums__results">
        <AlbumCard v-for="item in albums" :key="item.id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getAlbums } from '@/api/artist'
import Container from '@/components/Container/index.vue'

export default {
  name: 'ArtistAllAlbums',
  components: {
    AlbumCard,
    TitleSimple,
    AlbumCard,
    Container
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
  padding: 1.6rem;

  &__results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  }
}
</style>
