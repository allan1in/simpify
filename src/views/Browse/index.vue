<template>
  <Container :loading @load-more="getPlaylists">
    <div class="browse-container">
      <div class="browse-container__cover">
        <h1 class="browse-container__cover__title">{{ category.name }}</h1>
      </div>
      <div class="browse-container__content">
        <PlaylistCard v-for="item in playlists" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import { getCategory, getCategoryPlaylists, getNextCategoryPlaylists } from '@/api/browse.js'
import PlaylistCard from '@/components/CardPlaylist/index.vue'

export default {
  nmae: 'Browse',
  components: {
    Container,
    TitleSimple,
    PlaylistCard
  },
  data() {
    return {
      loading: true,
      category: {},
      playlists: [],
      limit: 28,
      offset: 0,
      next: '',
      loadMore: false
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
      if (!this.loadMore && this.next !== null) {
        let res
        this.loadMore = true

        if (this.next === '') {
          const params = {
            limit: this.limit,
            offset: this.offset
          }
          res = (await getCategoryPlaylists(this.$route.params.categoryId, params)).data.playlists
        } else {
          let path = this.next
          res = (
            await getNextCategoryPlaylists(
              this.$route.params.categoryId,
              path.slice(path.indexOf('?') + 1)
            )
          ).data.playlists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]

        this.next = res.next
        this.offset = res.offset + res.limit

        this.loadMore = false
        this.loading = false
      }
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
  &__cover {
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    padding: 4.8rem 3.2rem;

    &__title {
      font-size: 8rem;
      font-weight: 800;
      font-family: $font-family-title;
      text-shadow: 0 0 20px rgba($color-bg-1, 1);
    }
  }

  &__content {
    padding: 1.6rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  }
}
</style>
