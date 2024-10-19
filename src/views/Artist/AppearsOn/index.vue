<template>
  <Container :loading>
    <div class="artist-all-appears-on">
      <TitleSimple :title="'Appears On'" />
      <div class="artist-all-appears-on__results">
        <AlbumCard v-for="item in appearsOn" :key="item.id" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import AlbumCard from '@/components/AlbumCard/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getAppearsOn } from '@/api/artist'
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
      appearsOn: {},
      loading: true
    }
  },
  methods: {
    async getAppearsOn() {
      const params = {
        limit: 28,
        offset: 0
      }
      const res = (await getAppearsOn(this.$route.params.artistId, params)).data.items
      this.appearsOn = res
      this.loading = false
    }
  },
  created() {
    this.getAppearsOn()
  }
}
</script>

<style lang="scss" scoped>
.artist-all-appears-on {
  padding: 2.4rem;

  &__results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  }
}
</style>
