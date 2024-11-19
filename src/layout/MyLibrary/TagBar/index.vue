<template>
  <div
    ref="wrapper"
    class="top-bar-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <i v-show="showShadow && !reachedLeft" class="top-bar-wrapper__shadow-left"></i>
    <i v-show="showShadow && !reachedRight" class="top-bar-wrapper__shadow-right"></i>
    <Transition name="fade">
      <button
        v-show="showArrow && !reachedLeft"
        class="top-bar-wrapper__arrow top-bar-wrapper__arrow-left"
        @click.prevent="scrollX('pre')"
      >
        <div class="top-bar-wrapper__arrow__icon-wrapper">
          <IconArrowLeft />
        </div>
      </button>
    </Transition>
    <Transition name="fade">
      <button
        v-show="showArrow && !reachedRight"
        class="top-bar-wrapper__arrow top-bar-wrapper__arrow-right"
        @click.prevent="scrollX('next')"
      >
        <div class="top-bar-wrapper__arrow__icon-wrapper">
          <IconArrowRight />
        </div>
      </button>
    </Transition>
    <div ref="topBar" class="top-bar-wrapper__top-bar">
      <template v-for="tag in tags" :key="tag">
        <TagButton
          class="top-bar-wrapper__top-bar__btn"
          @handle-click="$emit('handleClickTag', tag)"
          :text="$t(`top_bar.${tag}`)"
          :isActive="isActive === tag"
        />
      </template>
    </div>
  </div>
</template>
<script>
import TagButton from '@/components/TagButton/index.vue'
import IconArrowRight from '@/components/Icons/IconArrowRight.vue'
import IconArrowLeft from '@/components/Icons/IconArrowLeft.vue'
import { mapWritableState } from 'pinia'
import { useLibraryStore } from '@/stores/library'

export default {
  name: 'TagBar',
  props: {
    tags: {
      type: Array,
      default: []
    },
    isActive: {
      type: String,
      default: ''
    }
  },
  components: {
    TagButton,
    IconArrowRight,
    IconArrowLeft
  },
  data() {
    return {
      showArrow: false,
      showShadow: false,
      reachedLeft: true,
      reachedRight: false
    }
  },
  computed: {
    ...mapWritableState(useLibraryStore, ['myLibWidth'])
  },
  methods: {
    handleMouseEnter() {
      if (this.$refs.wrapper.offsetWidth < this.$refs.topBar.offsetWidth) {
        this.showArrow = true
        this.showShadow = true
      }
    },
    handleMouseLeave() {
      if (this.$refs.wrapper.offsetWidth < this.$refs.topBar.offsetWidth) {
        this.showArrow = false
        this.showShadow = true
      }
    },
    scrollX(direction, distance) {
      // Set default distance
      if (direction == 'pre') {
        distance = 0 - this.$refs.wrapper.offsetWidth
      } else if (direction == 'next') {
        distance = this.$refs.wrapper.offsetWidth
      } else {
        return
      }

      // Show both of arrows
      this.reachedLeft = false
      this.reachedRight = false

      const minLeft = this.$refs.wrapper.offsetWidth - this.$refs.topBar.offsetWidth
      let left = this.$refs.topBar.style.left || '0px'
      let newLeft = left.split('px')[0] - distance

      if (newLeft <= minLeft) {
        this.reachedRight = true
        newLeft = minLeft
      } else if (newLeft >= 0) {
        this.reachedLeft = true
        newLeft = 0
      }

      this.$refs.topBar.style.left = newLeft + 'px'
    }
  },
  watch: {
    // Update the left(position-left) value of the top bar when the width value of resize box changed
    myLibWidth(newVal, oldVal) {
      // Show both of arrows
      this.reachedLeft = false
      this.reachedRight = false

      // Get current left value
      let left = this.$refs.topBar.style.left?.split('px')[0] || 0
      // Get the minimum left value
      const minLeft = this.$refs.wrapper.offsetWidth - this.$refs.topBar.offsetWidth

      if (this.$refs.wrapper.offsetWidth >= this.$refs.topBar.offsetWidth) {
        this.$refs.topBar.style.left = 0
        this.showShadow = false
      } else {
        if (left <= minLeft) {
          // Already reached the far right
          // The left value is smaller, the top bar inside is closer to right
          this.reachedRight = true
          this.$refs.topBar.style.left = minLeft + 'px'
        } else if (left >= 0) {
          // Already reached the far left
          this.reachedLeft = true
          this.$refs.topBar.style.left = 0 + 'px'
        }
        this.showShadow = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.top-bar-wrapper {
  position: relative;
  overflow: hidden;

  &__shadow-left {
    display: block;
    height: 100%;
    width: 1rem;
    box-shadow: 0.5rem 0 1.6rem 0 $color-bg-1;
    position: absolute;
    left: -1rem;
    top: 0;
    z-index: 10;
  }

  &__shadow-right {
    display: block;
    height: 100%;
    width: 1rem;
    box-shadow: -0.5rem 0 1.6rem 0 $color-bg-1;
    position: absolute;
    right: -1rem;
    top: 0;
    z-index: 10;
  }

  &__arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    padding: 0.8rem;
    z-index: 10;
    background-color: $color-bg-3;
    opacity: 0.9;

    &-left {
      left: 0.8rem;
    }

    &-right {
      right: 0.8rem;
    }

    @include transitionFast;

    &:hover &__icon-wrapper {
      fill: $color-font-primary;
    }

    &:active {
      background-color: $color-bg-2;
    }

    &:active &__icon-wrapper {
      fill: $color-font-secondary;
    }

    &__icon-wrapper {
      height: $font-size-text-secondary;
      aspect-ratio: 1 / 1;
      fill: $color-font-secondary;

      @include transitionFast;
    }
  }

  &__top-bar {
    white-space: nowrap;
    padding: 2.4rem 0;
    width: max-content;
    position: relative;
    top: 0;
    left: 0;

    @include transition;

    &__btn {
      display: inline-block;
      margin-right: 1.2rem;
    }
  }
}
</style>
