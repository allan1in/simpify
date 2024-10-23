<template>
  <div class="title-show-all" v-if="routerName!==''">
    <router-link class="title-show-all__title" :to="{ name: routerName }">{{ title }}</router-link>
    <router-link class="title-show-all__show-all" :to="{ name: routerName }">Show All</router-link>
  </div>
  <h1 v-else class="title-simple">
    {{ title }}
  </h1>
</template>

<script>
export default {
  name: 'ShowAllTitle',
  props: {
    routerName: {
      type: String,
      require: false,
      default:''
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

.title-simple {
  display: block;
  padding: 1.6rem;

  @include titleStyles;
}
</style>
