<template>
  <main v-if="!loading" class="artist-container">
    <TitleSimple :title="'Artists'">
      <template #before-title>{{ artists.total + ' ' }}</template>
    </TitleSimple>
    <div class="artist-container__results">
      <ArtistCard v-for="item in artists.items" :key="item.id" :item="item" />
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import ArtistCard from '../../../../components/ArtistCard/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { searchArtists } from '@/api/search'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetArtists',
  props: ['showTypes'],
  components: {
    ArtistCard,
    TitleSimple,
    Loading
  },
  data() {
    return {
      artists: {},
      loading: true
    }
  },
  methods: {
    async getArtists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 28,
        offset: 0
      }
      const res = (await searchArtists(params)).data.artists
      this.artists = res
      this.loading = false
    }
  },
  mounted() {
    this.getArtists()
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  min-height: 100%;
  height: 100%;
  padding: 2.4rem;

  &__msg {
    padding-bottom: 1.6rem;
  }

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
