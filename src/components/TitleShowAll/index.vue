<template>
  <div class="title-show-all">
    <router-link class="title-show-all__title" :to="{ name: routerName }">{{ title }}</router-link>
    <router-link class="title-show-all__show-all" :to="{ name: routerName }">Show All</router-link>
  </div>
</template>

<script>
export default {
  name: 'ShowAllTitle',
  props: {
    routerName: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
.title-show-all {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.6rem;

  &__title {
    margin: 1.6rem 0;

    @include titleStyles;
  }

  &__show-all {
    font-size: 1.4rem;
    font-weight: 700;
    font-family: $font-family-title;
  }
}
</style>
