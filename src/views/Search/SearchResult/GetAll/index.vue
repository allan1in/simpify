<template>
  <section class="all-container">
    <div class="all-container__songs">
      <h1 class="all-container__songs__title">Songs</h1>
      <div class="all-container__songs__results"></div>
    </div>
  </section>
</template>

<script>
import all from './all.json'

export default {
  name: 'GetAll',
  data() {
    return {
      all
    }
  }
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
