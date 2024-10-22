<template>
  <h1 class="title-simple">
    {{ title }}
  </h1>
</template>

<script>
export default {
  name: 'TitleSimple',
  props: {
    title: {
      type: String,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
.title-simple {
  display: block;
  padding: 1.6rem;

  @include titleStyles;
}
</style>
