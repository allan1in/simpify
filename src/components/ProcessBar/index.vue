<template>
  <div
    ref="process"
    class="process"
    :class="{ disabled__process: disabled, 'no-hover-dot': !draggable }"
    @mousedown="handleMouseDown"
  >
    <div class="process__line" :class="{ disabled__process__line: disabled }">
      <div
        ref="position"
        class="process__line__position"
        :style="{ left: `calc(${percentage}% - 100%)` }"
        :class="{ disabled__process__line__position: disabled }"
      ></div>
    </div>
    <div
      ref="dot"
      class="process__dot"
      :class="{ disabled__process__dot: disabled }"
      :style="{ left: `${percentage}%` }"
    ></div>
  </div>
</template>
<script>
export default {
  name: 'ProcessBar',
  props: {
    percentage: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleMouseDown(event) {
      if (this.disabled || !this.draggable) {
        return
      }
      // Prevent default drag events
      event.preventDefault()

      let prePos = event.clientX
      let nextPos
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
      let minPos = this.$refs.process.getBoundingClientRect().left
      let maxPos = this.$refs.process.getBoundingClientRect().right
      let width = this.$refs.process.getBoundingClientRect().width
      let newVal

      this.$emit('mouseDown')
      newVal = 100 * ((event.clientX - minPos) / width)
      this.$emit('updatePercentage', newVal)
      document.onmousemove = (e) => {
        if (e.clientX > maxPos) {
          this.$refs.position.style.left = 0 + 'px'
          this.$refs.dot.style.left = this.$refs.position.style.left + this.$refs.dot.width / 2

          newVal = 100 * ((maxPos - minPos) / width)
        } else if (e.clientX < minPos) {
          this.$refs.position.style.left = '-' + this.$refs.process.width + 'px'
          this.$refs.dot.style.left = this.$refs.position.style.left + this.$refs.dot.width / 2

          newVal = 100 * ((minPos - minPos) / width)
        } else {
          nextPos = prePos - e.clientX
          prePos = e.clientX
          this.$refs.position.style.left = this.$refs.position.offsetLeft - nextPos + 'px'
          this.$refs.dot.style.left = this.$refs.dot.offsetLeft - nextPos + 'px'

          newVal = 100 * ((e.clientX - minPos) / width)
        }

        this.$emit('updatePercentage', newVal)
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        this.$emit('mouseUp')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$progress-line-color: #4d4d4d;

.no-hover-dot:nth-child(n) {
  &:hover .process__dot {
    display: none;
  }

  &:active .process__dot {
    display: none;
  }
}

.disabled__process {
  opacity: 0.3;

  &:hover &__line__position:nth-child(n),
  &:active &__line__position:nth-child(n) {
    background-color: $color-font-primary;
  }

  &:hover &__dot:nth-child(n),
  &:active &__dot:nth-child(n) {
    display: none;
  }

  &__line:nth-child(n) {
    cursor: not-allowed;
  }

  &__line__position:nth-child(n) {
    cursor: not-allowed;
  }

  &__dot:nth-child(n) {
    cursor: not-allowed;
  }
}

.process {
  flex: 1;
  position: relative;
  width: 100%;
  height: 0.4rem;

  &:hover &__line__position,
  &:active &__line__position {
    background-color: $color-brand;
  }

  &:hover &__dot,
  &:active &__dot {
    display: block;
  }

  &__line {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba($color-bg-7, 0.6);
    width: 100%;
    height: 0.4rem;
    border-radius: 0.2rem;
    overflow: hidden;
    cursor: pointer;

    &__position {
      position: absolute;
      left: -100%;
      top: 0;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      background-color: $color-font-primary;
      cursor: pointer;
    }
  }

  &__dot {
    display: none;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 1.2rem;
    width: 1.2rem;
    background-color: $color-font-primary;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
