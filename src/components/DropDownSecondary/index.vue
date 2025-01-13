<template>
  <div class="drop-down-container">
    <div
      ref="trigger"
      class="drop-down-container__click-wrapper"
      @mouseenter.prevent="handleMouseEnter"
    >
      <slot name="trigger"></slot>
    </div>
    <div
      ref="box"
      v-show="modelValue"
      class="drop-down-container__box"
      :style="{ top: top, left: left }"
    >
      <ul>
        <slot name="dropDownItems"></slot>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropDownSecondary',
  props: {
    modelValue: {}
  },
  data() {
    return {
      top: 'unset',
      left: 'unset'
    }
  },
  methods: {
    setPosition() {
      this.$nextTick(() => {
        const triggerRect = this.$refs.trigger.getBoundingClientRect()
        const boxRect = this.$refs.box.getBoundingClientRect()
        const viewWidth = window.innerWidth

        let position = {
          left: triggerRect.width + 'px',
          top: 0
        }

        if (boxRect.width + triggerRect.right > viewWidth) {
          position.left = 0 - boxRect.width + 'px'
        }

        this.left = position.left
        this.top = position.top
      })

      this.left = this.$refs.trigger.offsetWidth + 'px'

      this.right = this.$refs.trigger.offsetWidth + 'px'
    },
    handleMouseEnter() {
      this.$emit('handleMouseEnter')
      this.setPosition()

      // Hide element when click outside of it.
      document.addEventListener('mouseup', this.hide)
    },
    hide(event) {
      if (
        !this.$refs?.trigger?.contains(event.target) &&
        !this.$refs?.box?.contains(event.target)
      ) {
        this.$emit('update:modelValue', false)
        document.removeEventListener('mouseup', this.hide)
      }
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
    z-index: 10;
    box-shadow: 0 0 1.5rem 1rem rgba($color-bg-1, 0.2);
  }
}
</style>
