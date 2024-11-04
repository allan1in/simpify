<template>
  <div class="search-container" v-if="!loading">
    <div class="search-container__title-wrapper">
      <TitleShowAll title="Browse All" />
    </div>
    <div class="search-container__cards-wrapper">
      <router-link :to="{ name: 'Browse', params: { categoryId: item.id } }"
        class="search-container__cards-wrapper__card" v-for="(item, index) in categories" :key="item.id">
        <h2 class="search-container__cards-wrapper__card__name">{{ item.name }}</h2>
        <img v-if="item.cover" class="search-container__cards-wrapper__card__img" :src="item.cover" :alt="item.name" />
      </router-link>
    </div>
  </div>
</template>

<script>
import {
  getSeveralCategories,
  getCategoryPlaylists,
  getNextSeveralCategories
} from '@/api/meta/browse'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Search',
  components: {
    TitleShowAll
  },
  data() {
    return {
      categories: [],
      categories_limit: 16,
      categories_next: '',
      categories_offset: 0
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getSeveralCategories()
      await this.getCategoriesCovers()

      this.loading = false
    },
    async getNext() {
      if (this.categories_next !== null) {
        await this.getSeveralCategories()
        await this.getCategoriesCovers()
      }
      this.loadMore = false
    },
    async getSeveralCategories() {
      if (!this.loading_more && this.categories_next !== null) {
        this.loading_more = true
        let res

        if (this.categories_next === '') {
          const params = {
            limit: this.categories_limit,
            offset: this.categories_offset
          }
          res = (await getSeveralCategories(params)).categories
        } else {
          let path = this.categories_next
          res = (await getNextSeveralCategories(path.slice(path.indexOf('?') + 1))).categories
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.categories))
        this.categories = [...oldVals, ...newVals]

        this.categories_next = res.next
        this.categories_offset = res.offset + res.limit

        this.loading_more = false
      }
      this.loadMore = false
    },
    async getCategoriesCovers() {
      this.categories.forEach(async (item, index) => {
        // Skip elements in the array that already have a cover property
        if (index + 1 <= this.categories_offset - this.categories_limit) {
          return
        }

        const params = {
          limit: 1,
          offset: 0
        }
        const res = (await getCategoryPlaylists(item.id, params)).playlists.items
        item.cover = res[0] ? res[0].images[0].url : ''
      })
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getNext()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  padding: 1.6rem;

  &__cards-wrapper {
    padding: 1.6rem;
    gap: $gutter-4x;

    @include gridCardsLess;

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
