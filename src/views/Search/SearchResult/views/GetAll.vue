<template>
  <section class="all-container">
    <div class="all-container__songs">
      <h1 class="all-container__songs__title">All</h1>
      <div class="all-container__songs__results"></div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GetAll'
}
</script>

<style lang="scss" scoped>
.all-container {
  &__songs {
    &__title {
      font-family: $font-family-title;
      font-size: 2.4rem;
    }
  }
}
</style>
