<template>
  <button class="tag-button" :class="{ 'btn-active': activeTag }" @click="$emit('handleClick')">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'TagButton',
  emits: ['handleClick'],
  props: {
    activeTag: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.tag-button {
  background-color: $color-bg-5;
  color: $color-font-primary;
  padding: 0.4rem 1.2rem;
  height: 3.2rem;
  border-radius: 9999rem;
  font-size: $font-size-text-secondary;

  &:hover {
    background-color: $color-bg-6;
  }
}

.btn-active:nth-child(n) {
  background-color: $color-font-primary;
  color: $color-bg-1;

  &:hover {
    background-color: $color-font-primary;
  }
}
</style>
