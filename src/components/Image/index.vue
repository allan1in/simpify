<template>
  <div class="img-container" :class="imgContainerClass" :style="colorStyle">
    <img
      loading="lazy"
      :src
      :alt
      @load="handleLoad"
      @error="handleError"
      class="img-container__img"
      :class="imgClass"
    />
  </div>
</template>

<script>
export default {
  name: 'Image',
  data() {
    return {
      loadFinish: false
    }
  },
  computed: {
    imgClass() {
      return {
        'img-hidden': !this.loadFinish,
        'img-show': this.loadFinish
      }
    },
    colorStyle() {
      return `background: ${this.getRandomHSL()}`
    },
    imgContainerClass() {
      return { 'img-loading': !this.loadFinish, 'img-container-scale': !this.noScale }
    }
  },
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    noScale: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleLoad() {
      this.loadFinish = true
    },
    handleError() {
      console.log('error!')
    },
    getRandomHSL() {
      const h = Math.floor(Math.random() * 360)
      return `hsl(${h}, 40%, 50%)`
    }
  },
  watch: {
    src() {
      this.loadFinish = false
    }
  }
}
</script>

<style lang="scss" scoped>
.img-container {
  overflow: hidden;

  @include transition;

  &-scale {
    &:hover {
      transform: scale(1.1);
    }
  }

  &__img {
    object-fit: cover;
    width: 100%;
    height: 100%;

    @include transition;
  }
}

.img {
  &-hidden {
    opacity: 0;
  }

  &-show {
    opacity: 1;
  }

  &-loading {
    animation: pulse 1.6s infinite;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}
</style>
