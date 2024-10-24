<template>
  <div class="process" @mousedown="handleMouseDown">
    <div class="process__line">
      <div
        ref="seek"
        class="process__line__seek"
        :style="{ left: `calc(${percentage}% - 100%)` }"
      ></div>
    </div>
    <div ref="dot" class="process__dot" :style="{ left: `${percentage}%` }"></div>
  </div>
</template>
<script>
export default {
  name: 'ProcessBar',
  props: {
    percentage: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleMouseDown(event) {
      this.$emit('update', event)

      let prePos = event.clientX
      let nextPos

      document.onmousemove = (e) => {
        nextPos = prePos - e.clientX
        prePos = e.clientX
        this.$refs.seek.style.left = this.$refs.seek.offsetLeft - nextPos + 'px'
        this.$refs.dot.style.left = this.$refs.dot.offsetLeft - nextPos + 'px'
        // console.log(this.$refs.seek.style.left)
        // console.log(this.$refs.dot.style.left)
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$progress-line-color: #4d4d4d;

.process {
  flex: 1;
  position: relative;
  width: 100%;
  height: 0.4rem;
  user-select: none;

  &:hover &__line__seek,
  &:active &__line__seek {
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
    background-color: $progress-line-color;
    width: 100%;
    height: 0.4rem;
    border-radius: 0.2rem;
    overflow: hidden;
    cursor: pointer;
    user-select: none;

    &__seek {
      position: absolute;
      left: -100%;
      top: 0;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      background-color: $color-font-primary;
      cursor: pointer;
      user-select: none;
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
    user-select: none;
  }
}
</style>
