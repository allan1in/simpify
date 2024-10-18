<template>
  <MyOverlayScrollbars os-element="main">
    <div class="browse-container">
      <div v-if="!loading">
        <div class="browse-container__cover">
          <h1 class="browse-container__cover__title">{{ category.name }}</h1>
        </div>
        <div class="browse-container__content">
          <PlaylistCard v-for="item in playlists" :item="item" />
        </div>
      </div>
      <Loading :loading />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getCategory, getCategoryPlaylists } from '@/api/categories.js'
import PlaylistCard from '@/components/PlaylistCard/index.vue'

export default {
  nmae: 'Browse',
  components: {
    MyOverlayScrollbars,
    Loading,
    TitleSimple,
    PlaylistCard
  },
  data() {
    return {
      loading: true,
      category: {},
      playlists: {}
    }
  },
  methods: {
    async getAll() {
      await this.getCategory()
      await this.getPlaylists()
      this.loading = false
    },
    async getCategory() {
      const res = (await getCategory(this.$route.params.categoryId)).data
      this.category = res
    },
    async getPlaylists() {
      const params = {
        limit: 28,
        offset: 0
      }
      const res = (await getCategoryPlaylists(this.$route.params.categoryId, params)).data.playlists
        .items
      this.playlists = res
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
$color-bg-cover: hsl(random(360), 40%, 50%);

.browse-container {
  height: $height-content;
  min-height: $height-content;
  &__cover {
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    padding: 4.8rem 2.4rem;

    &__title {
      font-size: 8rem;
      font-weight: 800;
      font-family: $font-family-title;
      text-shadow: 0 0 20px rgba($color-bg-1, 1);
    }
  }

  &__content {
    padding: 2.4rem;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
