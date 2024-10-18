<template>
  <MyOverlayScrollbars os-element="main">
    <div class="search-container">
      <div class="search-container__content" v-if="!loading">
        <div class="search-container__content__title-wrapper">
          <h1 class="search-container__content__title-wrapper__title">Browse All</h1>
        </div>
        <div class="search-container__content__cards-wrapper">
          <router-link
            :to="{ name: 'Browse', params: { categoryId: item.id } }"
            class="search-container__content__cards-wrapper__card"
            v-for="(item, index) in categories"
            :key="item.id"
          >
            <h2 class="search-container__content__cards-wrapper__card__name">{{ item.name }}</h2>
            <img
              class="search-container__content__cards-wrapper__card__img"
              :src="this.covers[index]"
              :alt="item.name"
            />
          </router-link>
        </div>
      </div>
      <Loading :loading="loading" />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'
import { getSeveralCategories } from '@/api/categories'
import { searchPlaylists } from '@/api/search'

export default {
  name: 'Search',
  components: {
    MyOverlayScrollbars,
    Loading
  },
  data() {
    return {
      loading: true,
      categories: {},
      covers: [],
      limit: 28
    }
  },
  methods: {
    async getAll() {
      await this.getSeveralCategories()
      await this.getCategoriesCovers()
      this.loading = false
    },
    async getSeveralCategories() {
      const params = {
        limit: this.limit,
        offset: 0
      }
      const res = (await getSeveralCategories(params)).data.categories.items
      this.categories = res
    },
    async getCategoriesCovers() {
      const params = {
        locale: 'en_AM',
        limit: this.limit,
        offset: 0
      }
      const categories = (await getSeveralCategories(params)).data.categories.items
      categories.forEach(async (item) => {
        const params = {
          q: item.name,
          limit: 1,
          offset: 0
        }
        const res = (await searchPlaylists(params)).data.playlists.items
        this.covers.push(res[0].images[0].url)
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
  min-height: $height-content;

  &__content {
    padding: 2.4rem;

    &__title-wrapper {
      padding: 0.8rem 0;

      &__title {
        @include titleStyles;
      }
    }

    &__cards-wrapper {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2.4rem;
      padding: 2.4rem 0;

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
}
</style>
