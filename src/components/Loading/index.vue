<template>
  <div v-if="loading" class="loading-wrapper">
    <h1 class="loading-wrapper__loading">Loading...</h1>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    loading: {
      type: Boolean,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-wrapper {
  height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.4rem;

  &__loading {
    font-size: 3.2rem;
  }
}
</style>
