<template>
  <MyOverlayScrollbars v-if="!loading" :os-class="'artist-all-appears-on'" :os-element="'main'">
    <TitleSimple :title="'Appears On'" />
    <div class="artist-all-appears-on__results">
      <AlbumCard v-for="item in appearsOn" :key="item.id" :item="item" />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import AlbumCard from '@/components/AlbumCard/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getAppearsOn } from '@/api/artists'

export default {
  name: 'ArtistAllApearsOn',
  components: {
    MyOverlayScrollbars,
    AlbumCard,
    TitleSimple,
    AlbumCard
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
  height: inherit;
  padding: 2.4rem;

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
