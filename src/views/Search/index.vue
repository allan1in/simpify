<template>
  <MyOverlayScrollbars :os-element="'main'" :os-class="'search-container'">
    <!-- <div class="search-container__title-wrapper">
      <h1 class="search-container__title-wrapper__title">Browse All</h1>
    </div>
    <div class="search-container__cards-wrapper">
      <div class="search-container__cards-wrapper__card" v-for="i in 21" :key="i">
        <h2 class="search-container__cards-wrapper__card__name">Genre {{ i }}</h2>
        <img
          class="search-container__cards-wrapper__card__img"
          src="../../assets/search-album-test.jfif"
          alt=""
        />
      </div>
    </div> -->
    <Loading :loading="loading" />
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'Search',
  components: {
    MyOverlayScrollbars,
    Loading
  },
  data() {
    return {
      loading: true
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  min-height: calc($height-content);
  height: 100%;

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
      background-color: #dc148c;
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
