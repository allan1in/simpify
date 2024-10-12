<template>
  <main v-if="!loading" class="album-container">
    <div class="album-container__msg">
      <h1 class="album-container__msg__total">{{ albums.total }} Albums</h1>
    </div>
    <div class="album-container__results">
      <AlbumCard v-for="item in albums.items" :key="item.id" :item="item" />
    </div>
  </main>
</template>

<script>
import { searchAlbums } from '@/api/search'
import AlbumCard from '../../../../components/AlbumCard/index.vue'

export default {
  name: 'GetAlbums',
  props: ['showTypes'],
  data() {
    return {
      albums: {},
      loading: true
    }
  },
  components: {
    AlbumCard
  },
  methods: {
    async getAlbums() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 30,
        offset: 0
      }
      const res = (await searchAlbums(params)).data.albums
      this.albums = res
      this.loading = false
    }
  },
  mounted() {
    this.getAlbums()
  }
}
</script>

<style lang="scss" scoped>
.album-container {
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
