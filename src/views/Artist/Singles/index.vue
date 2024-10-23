<template>
  <Container :loading @load-more="getSingles">
    <div class="artist-all-singles">
      <TitleShowAll :title="'Singles'" />
      <div class="artist-all-singles__results">
        <AlbumCard v-for="item in singles" :key="item.id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { getSingles, getNextSingles } from '@/api/artist'
import Container from '@/components/Container/index.vue'

export default {
  name: 'ArtistAllSingles',
  components: {
    AlbumCard,
    TitleShowAll,
    AlbumCard,
    Container
  },
  data() {
    return {
      singles: [],
      loading: true,
      id: this.$route.params.artistId,
      singles_limit: 28,
      singles_offset: 0,
      singles_next: '',
      singles_loadMore: false
    }
  },
  methods: {
    async getSingles() {
      if (!this.singles_loadMore && this.singles_next !== null) {
        let res
        this.singles_loadMore = true

        if (this.singles_next === '') {
          const params = {
            limit: this.singles_limit,
            offset: this.singles_offset
          }
          res = (await getSingles(this.id, params)).data
        } else {
          let path = this.singles_next
          res = (await getNextSingles(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.singles))
        this.singles = [...oldVals, ...newVals]
        this.singles_next = res.next

        this.singles_loadMore = false
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
    grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
  }
}
</style>
