<template>
  <Container :loading @load-more="getSingles">
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
import { getSingles, getNextSingles } from '@/api/artist'
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
      singles: [],
      loading: true,
      id: this.$route.params.artistId,
      limit: 14,
      offset: 0,
      next: '',
      loadMore: false
    }
  },
  methods: {
    async getSingles() {
      if (!this.loadMore && this.next !== null) {
        let res
        this.loadMore = true

        if (this.next === '') {
          const params = {
            limit: this.limit,
            offset: this.offset
          }
          res = (await getSingles(this.id, params)).data
        } else {
          let path = this.next
          res = (await getNextSingles(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.singles))
        this.singles = [...oldVals, ...newVals]
        this.next = res.next

        this.loadMore = false
        this.loading = false
      }
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
