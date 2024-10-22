<template>
  <Container :loading @load-more="getAll">
    <div class="search-container">
      <div class="search-container__title-wrapper">
        <h1 class="search-container__title-wrapper__title">Browse All</h1>
      </div>
      <div class="search-container__cards-wrapper">
        <router-link
          :to="{ name: 'Browse', params: { categoryId: item.id } }"
          class="search-container__cards-wrapper__card"
          v-for="(item, index) in categories"
          :key="item.id"
        >
          <h2 class="search-container__cards-wrapper__card__name">{{ item.name }}</h2>
          <img
            v-if="item.cover"
            class="search-container__cards-wrapper__card__img"
            :src="item.cover"
            :alt="item.name"
          />
        </router-link>
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container/index.vue'
import { getSeveralCategories, getCategoryPlaylists, getNextSeveralCategories } from '@/api/browse'

export default {
  name: 'Search',
  components: {
    Container
  },
  data() {
    return {
      loading: true,
      categories: [],
      limit: 28,
      next: '',
      offset: 0,
      loadMore: false
    }
  },
  methods: {
    async getAll() {
      if (!this.loadMore && this.next !== null) {
        this.loadMore = true

        await this.getSeveralCategories()
        await this.getCategoriesCovers()

        this.loadMore = false
        this.loading = false
      }
    },
    async getSeveralCategories() {
      let res
      this.loadMore = true

      if (this.next === '') {
        const params = {
          limit: this.limit,
          offset: this.offset
        }
        res = (await getSeveralCategories(params)).data.categories
      } else {
        let path = this.next
        res = (await getNextSeveralCategories(path.slice(path.indexOf('?') + 1))).data.categories
      }

      let newVals = res.items
      let oldVals = JSON.parse(JSON.stringify(this.categories))
      this.categories = [...oldVals, ...newVals]

      this.next = res.next
      this.offset = res.offset + res.limit

      this.loadMore = false
    },
    async getCategoriesCovers() {
      this.categories.forEach(async (item, index) => {
        // Skip elements in the array that already have a cover property
        if (index + 1 <= this.offset - this.limit) {
          return
        }

        const params = {
          limit: 1,
          offset: 0
        }
        const res = (await getCategoryPlaylists(item.id, params)).data.playlists.items
        item.cover = res[0].images[0].url
      })
    }
  },
  async created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  padding: 2.4rem;

  &__title-wrapper {
    padding: 1.6rem 0;

    &__title {
      @include titleStyles;
    }
  }

  &__cards-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(30rem, 100%), 1fr));
    gap: 2.4rem;

    &__card {
      aspect-ratio: 7 / 4;
      border-radius: $border-radius-default;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      background: linear-gradient(-65deg, $color-bg-4 20%, $color-bg-3 70%);

      &:hover {
        text-decoration: none;
      }

      &__name {
        padding: 1.6rem;

        @include titleStyles;
      }

      &__img {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 45%;
        aspect-ratio: 1 / 1;
        background-color: $color-bg-1;
        transform: rotate(25deg) translate(18%, -2%);
        border-radius: calc($gutter / 2);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
