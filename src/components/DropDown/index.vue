<template>
  <div class="drop-down-container">
    <div
      ref="trigger"
      class="drop-down-container__click-wrapper"
      @click.prevent="handleClick"
      @mouseenter.prevent="handleMouseEnter"
    >
      <slot name="trigger"></slot>
    </div>
    <Teleport to="body">
      <div
        ref="box"
        v-show="modelValue"
        class="drop-down-container__box"
        :style="{ top: top, left: left }"
      >
        <ul class="drop-down-container__box__items-wrapper">
          <slot name="dropDownItems"></slot>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<script>
export default {
  name: 'DropDown',
  props: {
    gutter: {
      type: Number,
      default: 8
    },
    modelValue: {}
  },
  data() {
    return {
      top: '0',
      left: '0'
    }
  },
  methods: {
    setPosition() {
      this.$nextTick(() => {
        const triggerRect = this.$refs.trigger.getBoundingClientRect()
        const boxRect = this.$refs.box.getBoundingClientRect()
        const viewWidth = window.innerWidth
        const viewHeight = window.innerHeight

        let position = {
          left: triggerRect.left + 'px',
          top: triggerRect.bottom + this.gutter + 'px'
        }

        if (boxRect.width + triggerRect.left > viewWidth) {
          position.left = triggerRect.right - boxRect.width + 'px'
        }

        if (triggerRect.bottom + this.gutter + boxRect.height > viewHeight) {
          position.top = triggerRect.top - boxRect.height - this.gutter + 'px'
        }

        this.left = position.left
        this.top = position.top
      })
    },
    handleClick() {
      this.$emit('update:modelValue', !this.modelValue)
      this.setPosition()

      // Hide element when click outside of it.
      document.addEventListener('mouseup', this.hide)
    },
    hide(event) {
      if (!this.$refs.trigger) {
        document.removeEventListener('mouseup', this.hide)
      } else if (
        !this.$refs.trigger.contains(event.target) &&
        !this.$refs.box.contains(event.target)
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
    z-index: 99999;
    box-shadow: 0 0 1.5rem 1rem rgba($color-bg-1, 0.2);

    &__items-wrapper {
      padding: 0.3rem;
    }
  }
}
</style>
