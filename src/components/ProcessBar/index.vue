<template>
  <div class="process">
    <div class="process__line">
      <div class="process__line__seek" :style="{ left: `calc(${percentage}% - 100%)` }"></div>
    </div>
    <div class="process__dot" :style="{ left: `${percentage}%` }"></div>
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
  }
}
</script>
<style lang="scss" scoped>
$progress-line-color: #4d4d4d;
.process {
  flex: 1;
  position: relative;
  width: 100%;

  &:hover &__line__seek {
    background-color: $font-color-active;
  }

  &:hover &__dot {
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

    &__seek {
      position: absolute;
      left: -100%;
      top: 0;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      background-color: $font-color;
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
    background-color: $font-color;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
