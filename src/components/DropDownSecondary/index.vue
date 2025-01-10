<template>
  <div class="drop-down-container">
    <div
      ref="clickWrapper"
      class="drop-down-container__click-wrapper"
      @mouseenter.prevent="handleMouseEnter"
    >
      <slot></slot>
    </div>

    <Transition name="fade-slide-from-top">
      <div
        ref="box"
        v-show="modelValue"
        class="drop-down-container__box"
        :style="{ top: top, left: left, bottom: bottom, right: right }"
      >
        <ul class="drop-down-container__box__items-wrapper">
          <slot name="dropDownItems"></slot>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'DropDownSecondary',
  props: {
    position: {
      type: String,
      default: 'right-start'
    },
    modelValue: {}
  },
  data() {
    return {
      top: 'unset',
      bottom: 'unset',
      left: 'unset',
      right: 'unset'
    }
  },
  methods: {
    setPosition() {
      if (this.position.startsWith('right')) {
        this.left = this.$refs.clickWrapper.offsetWidth + 'px'
        if (this.position === 'right-start') {
          this.top = 0
        } else if (this.position === 'right-end') {
          this.bottom = 0
        }
      }
    },
    handleMouseEnter() {
      this.setPosition()

      this.$emit('handleMouseEnter')

      // Hide element when click outside of it.
      document.addEventListener('mouseup', this.hide)
    },
    hide(event) {
      if (!this.$refs.clickWrapper.contains(event.target)) {
        this.$emit('update:modelValue', false)
      }
      document.removeEventListener('mouseup', this.hide)
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

    &__items-wrapper {
      padding: 0.3rem;
    }
  }
}
</style>
