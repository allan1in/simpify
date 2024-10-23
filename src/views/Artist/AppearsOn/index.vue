<template>
  <Container :loading @load-more="getAppearsOn">
    <div class="artist-all-appears-on">
      <TitleShowAll :title="'Appears On'" />
      <div class="artist-all-appears-on__results">
        <AlbumCard v-for="item in appearsOn" :key="item.id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { getAppearsOn, getNextAppearsOn } from '@/api/artist'
import Container from '@/components/Container/index.vue'

export default {
  name: 'ArtistAllApearsOn',
  components: {
    AlbumCard,
    TitleShowAll,
    AlbumCard,
    Container
  },
  data() {
    return {
      id: this.$route.params.artistId,
      appearsOn: [],
      loading: true,
      appearsOn_limit: 28,
      appearsOn_offset: 0,
      appearsOn_next: '',
      appearsOn_next: false
    }
  },
  methods: {
    async getAppearsOn() {
      if (!this.appearsOn_next && this.appearsOn_next !== null) {
        let res
        this.appearsOn_next = true

        if (this.appearsOn_next === '') {
          const params = {
            limit: this.appearsOn_limit,
            offset: this.appearsOn_offset
          }
          res = (await getAppearsOn(this.id, params)).data
        } else {
          let path = this.appearsOn_next
          res = (await getNextAppearsOn(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.appearsOn))
        this.appearsOn = [...oldVals, ...newVals]
        this.appearsOn_next = res.next

        this.appearsOn_next = false
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
    grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
  }
}
</style>
