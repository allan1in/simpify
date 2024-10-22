<template>
  <Container :loading @load-more="getAlbums">
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
import { getAlbums, getNextAlbums } from '@/api/artist'
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
      id: this.$route.params.artistId,
      albums: [],
      loading: true,
      limit: 14,
      offset: 0,
      next: '',
      loadMore: false
    }
  },
  methods: {
    async getAlbums() {
      if (!this.loadMore && this.next !== null) {
        let res
        this.loadMore = true

        if (this.next === '') {
          const params = {
            limit: this.limit,
            offset: this.offset
          }
          res = (await getAlbums(this.id, params)).data
        } else {
          let path = this.next
          res = (await getNextAlbums(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))
        this.albums = [...oldVals, ...newVals]
        this.next = res.next

        this.loadMore = false
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
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  }
}
</style>
