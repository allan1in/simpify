<template>
  <main v-if="!loading" class="album-container">
    <div class="album-container__content">
      <TitleSimple :title="'Albums'">
        <template #before-title>{{ albums.total + ' ' }}</template>
      </TitleSimple>
      <div class="album-container__content__results">
        <AlbumCard v-for="item in albums.items" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import { searchAlbums } from '@/api/search'
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import Loading from '@/components/Loading/index.vue'

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
    TitleSimple,
    Loading
  },
  methods: {
    async getAlbums() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 28,
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
  min-height: inherit;

  &__content {
    padding: 2.4rem;

    &__msg {
      padding-bottom: 1.6rem;
    }

    &__results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
    }
  }
}
</style>
