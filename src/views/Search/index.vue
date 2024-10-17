<template>
  <MyOverlayScrollbars os-element="main">
    <div class="search-container">
      <div v-if="!loading">
        <div class="search-container__title-wrapper">
          <h1 class="search-container__title-wrapper__title">Browse All</h1>
        </div>
        <div class="search-container__cards-wrapper">
          <div
            class="search-container__cards-wrapper__card"
            :style="{ backgroundColor: 'hsl(' + Math.random() * 360 + ', 60%, 50%)' }"
            v-for="item in categories"
            :key="item.id"
          >
            <h2 class="search-container__cards-wrapper__card__name">{{ item.name }}</h2>
            <img
              class="search-container__cards-wrapper__card__img"
              :src="item.icons[0].url"
              :alt="item.name"
            />
          </div>
        </div>
      </div>
      <Loading :loading="loading" />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'
import categories from './categories.json'

export default {
  name: 'Search',
  components: {
    MyOverlayScrollbars,
    Loading
  },
  data() {
    return {
      loading: false,
      categories: categories.categories.items
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  min-height: $height-content;
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
        background-color: #006450;
        transform: rotate(25deg) translate(18%, -2%);
        border-radius: calc($gutter / 2);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
