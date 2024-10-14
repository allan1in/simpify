<template>
  <main v-if="!loading" class="album-container">
    <TitleSimple :title="'Albums'">
      <template #before-title>{{ albums.total + ' ' }}</template>
    </TitleSimple>
    <div class="album-container__results">
      <AlbumCard v-for="item in albums.items" :key="item.id" :item="item" />
    </div>
  </main>
</template>

<script>
import { searchAlbums } from '@/api/search'
import AlbumCard from '../../../../components/AlbumCard/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'

export default {
  name: 'GetAlbums',
  data() {
    return {
      albums: {},
      loading: true
    }
  },
  components: {
    AlbumCard,
    TitleSimple
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
  }

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
