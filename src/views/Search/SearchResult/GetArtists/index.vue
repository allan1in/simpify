<template>
  <main v-if="!loading" class="artist-container">
    <div class="artist-container__msg">
      <h1 class="artist-container__msg__total">{{ artists.total }} Artists</h1>
    </div>
    <div class="artist-container__results">
      <ArtistCard v-for="item in artists.items" :key="item.id" :item="item" />
    </div>
  </main>
</template>

<script>
import ArtistCard from '../../../../components/ArtistCard/index.vue'
import { searchArtists } from '@/api/search'

export default {
  name: 'GetArtists',
  props: ['showTypes'],
  components: {
    ArtistCard
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
        limit: 30,
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
  &__msg {
    padding-bottom: 1.6rem;

    &__total {
      @include titleStyles;
    }
  }

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
