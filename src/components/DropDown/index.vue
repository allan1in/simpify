<template>
  <div class="drop-down-container">
    <div @click="show = !show">
      <slot></slot>
    </div>

    <div
      v-show="show"
      class="drop-down-container__box"
      :style="{ transform: `translateY(${top})` }"
    >
      <ul class="drop-down-container__box__items-wrapper">
        <slot name="dropDownItems"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropDown',
  data() {
    return {
      show: false
    }
  },
  props: {
    top: {
      type: String,
      require: false,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.drop-down-container {
  position: relative;

  &__box {
    width: max-content;
    position: absolute;
    top: 0;
    right: 0;
    background-color: $color-bg-4;
    border-radius: $border-radius-small;

    &__items-wrapper {
      padding: 0.3rem;
    }
  }
}
</style>
