<template>
  <Container :loading @load-more="getAppearsOn">
    <div class="artist-all-appears-on">
      <TitleSimple :title="'Appears On'" />
      <div class="artist-all-appears-on__results">
        <AlbumCard v-for="item in appearsOn" :key="item.id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getAppearsOn, getNextAppearsOn } from '@/api/artist'
import Container from '@/components/Container/index.vue'

export default {
  name: 'ArtistAllApearsOn',
  components: {
    AlbumCard,
    TitleSimple,
    AlbumCard,
    Container
  },
  data() {
    return {
      id: this.$route.params.artistId,
      appearsOn: [],
      loading: true,
      limit: 14,
      offset: 0,
      next: '',
      loadMore: false
    }
  },
  methods: {
    async getAppearsOn() {
      if (!this.loadMore && this.next !== null) {
        let res
        this.loadMore = true

        if (this.next === '') {
          const params = {
            limit: this.limit,
            offset: this.offset
          }
          res = (await getAppearsOn(this.id, params)).data
        } else {
          let path = this.next
          res = (await getNextAppearsOn(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.appearsOn))
        this.appearsOn = [...oldVals, ...newVals]
        this.next = res.next

        this.loadMore = false
        this.loading = false
      }
    }
  },
  created() {
    this.getAppearsOn()
  }
}
</script>

<style lang="scss" scoped>
.artist-all-appears-on {
  padding: 1.6rem;

  &__results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  }
}
</style>
