<template>
  <h1 class="title-simple">
    <slot name="before-title"></slot>
    {{ title }}
    <slot name="after-title"></slot>
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
  padding: 1.6rem 0;

  @include titleStyles;
}
</style>
