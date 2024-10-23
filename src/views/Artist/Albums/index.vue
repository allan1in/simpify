<template>
  <Container :loading @load-more="getAlbums">
    <div class="artist-all-albums">
      <TitleShowAll :title="'Albums'" />
      <div class="artist-all-albums__results">
        <AlbumCard v-for="item in albums" :key="item.id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { getAlbums, getNextAlbums } from '@/api/artist'
import Container from '@/components/Container/index.vue'

export default {
  name: 'ArtistAllAlbums',
  components: {
    AlbumCard,
    TitleShowAll,
    AlbumCard,
    Container
  },
  data() {
    return {
      id: this.$route.params.artistId,
      albums: [],
      loading: true,
      albums_limit: 28,
      albums_offset: 0,
      albums_next: '',
      albums_loadMore: false
    }
  },
  methods: {
    async getAlbums() {
      if (!this.albums_loadMore && this.albums_next !== null) {
        let res
        this.albums_loadMore = true

        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await getAlbums(this.id, params)).data
        } else {
          let path = this.albums_next
          res = (await getNextAlbums(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))
        this.albums = [...oldVals, ...newVals]
        this.albums_next = res.next

        this.albums_loadMore = false
        this.loading = false
      }
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
    grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
  }
}
</style>
