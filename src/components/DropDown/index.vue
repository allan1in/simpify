<template>
  <div class="drop-down-container">
    <div ref="clickWrapper" class="drop-down-container__click-wrapper" @click.prevent="handleClick">
      <slot :open="show"></slot>
    </div>

    <Transition name="fade-slide-from-top">
      <div ref="box" v-show="show" class="drop-down-container__box" :style="{ top: top }"
        :class="{ 'drop-down-container__box-right': position === 'right' }">
        <ul class=" drop-down-container__box__items-wrapper">
          <slot name="dropDownItems"></slot>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'DropDown',
  props: {
    position: {
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      show: false,
      top: undefined
    }
  },
  methods: {
    handleClick(e) {
      this.top = this.$refs.clickWrapper.offsetHeight + 8 + 'px'
      this.show = !this.show
      // Hide element when click outside of it.
      document.onmouseup = (event) => {
        if (event.target != this.$refs.box && event.target != e.target) {
          this.show = false
        }
      }
    }
  },
  watch: {
    show(newVal, oldVal) {
      if (!newVal) {
        document.onmouseup = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.drop-down-container {
  position: relative;

  &__click-wrapper {
    height: max-content;
    width: max-content;
  }

  &__box {
    width: max-content;
    position: absolute;
    top: 0;
    right: 0;
    background-color: $color-bg-4;
    border-radius: $border-radius-small;
    z-index: 10;
    box-shadow: 0 0 1.5rem 1rem rgba($color-bg-1, 0.2);

    &-right:nth-child(n) {
      left: 0
    }

    &__items-wrapper {
      padding: 0.3rem;
    }
  }
}
</style>
