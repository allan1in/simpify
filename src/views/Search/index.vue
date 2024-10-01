<template>
  <main class="search-container">
    <div class="search-container__title-wrapper">
      <h1 class="search-container__title-wrapper__title">Browse All</h1>
    </div>
    <div class="search-container__cards-wrapper">
      <div class="search-container__cards-wrapper__card" v-for="i in 21" :key="i">
        <h2 class="search-container__cards-wrapper__card__name">
          {{ i }}{{ i }}{{ i }}{{ i }}{{ i }}{{ i }}{{ i }}{{ i }}
        </h2>
        <div class="search-container__cards-wrapper__card__img"></div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Search'
}
</script>

<style lang="scss" scoped>
.search-container {
  padding: 2.4rem;
  height: inherit;
  overflow: auto;

  &__title-wrapper {
    padding: 0.8rem 0;

    &__title {
      font-size: 2.4rem;
      font-family: 'SpotifyMixUITitle', sans-serif;
    }
  }

  &__cards-wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2.4rem;
    padding: 2.4rem 0;

    &__card {
      background-color: #dc148c;
      height: 20rem;
      border-radius: $gutter;
      position: relative;
      overflow: hidden;

      &__name {
        font-size: 2.4rem;
        font-family: 'SpotifyMixUITitle', sans-serif;
        padding: 1.6rem;
      }

      &__img {
        position: absolute;
        right: 0;
        bottom: 0;
        height: 15rem;
        width: 15rem;
        background-color: #006450;
        transform: rotate(25deg) translate(18%, -2%);
      }
    }
  }
}
</style>
