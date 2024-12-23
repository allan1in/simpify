<template>
  <div ref="resizeBox" class="my-library">
    <div class="my-library__resize-handle" @mousedown="handleMouseDown">
      <div class="my-library__resize-handle__line"></div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import { useLibraryStore } from '@/stores/library'
import { mapWritableState } from 'pinia'
import variables from '@/styles/export/variables.module.scss'

export default {
  name: 'ResizeBox',
  data() {
    return {
      minWidth: 280,
      maxWidth: undefined,
      collapsedWidth: 72,
      observer: undefined
    }
  },
  computed: {
    ...mapWritableState(useLibraryStore, [
      'duringTransitionWidth',
      'myLibWidth',
      'isCollasped',
      'isShowMore',
      'resizing'
    ])
  },
  methods: {
    handleMouseDown(event) {
      event.preventDefault()
      this.resizing = true

      this.$refs.resizeBox.style.transition = 'none'
      let boxLeft = this.$refs.resizeBox.getBoundingClientRect().left
      let newWidth

      document.onmousemove = (e) => {
        newWidth = e.clientX - boxLeft

        if (newWidth <= this.minWidth) {
          // Change the arrow to point to the right
          this.isShowMore = false

          if (newWidth > this.minWidth / 2) {
            // Open resizable box
            this.myLibWidth = this.minWidth
            this.isCollasped = false
            return
          } else {
            // Close resizable box
            this.isCollasped = true
            return
          }
        }

        // Update new Width
        this.$refs.resizeBox.style.width = newWidth + 'px'

        // Has reached the maximum width
        if (this.$refs.resizeBox.offsetWidth !== newWidth) {
          // Change the arrow to point to the left
          this.isShowMore = true
        }
      }

      document.onmouseup = () => {
        this.resizing = false
        document.onmousemove = null
        document.onmouseup = null
        this.$refs.resizeBox.style.transition = `width ${variables.duration_slow} ease`
        if (!this.isCollasped) {
          this.myLibWidth = newWidth
        }
      }
    },
    onTransitionEnd(event) {
      if (event.propertyName === 'width') {
        this.duringTransitionWidth = false
        this.resizing = false
      }
    },
    onTransitionStart(event) {
      if (event.propertyName === 'width') {
        this.duringTransitionWidth = true
        this.resizing = true
      }
    },
    startObserve() {
      this.$refs.resizeBox.addEventListener('transitionend', this.onTransitionEnd)
      this.$refs.resizeBox.addEventListener('transitionstart', this.onTransitionStart)
    },
    stopObserve() {
      this.$refs.resizeBox.removeEventListener('transitionend', this.onTransitionEnd)
      this.$refs.resizeBox.removeEventListener('transitionstart', this.onTransitionStart)
    },
    init() {
      this.$nextTick(() => {
        this.myLibWidth = this.minWidth
        this.$refs.resizeBox.style.width = this.myLibWidth + 'px'
      })
    }
  },
  watch: {
    isCollasped(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = this.collapsedWidth + 'px'
        })
      } else {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = Math.max(this.minWidth, this.myLibWidth) + 'px'
        })
      }
    },
    isShowMore(newVal) {
      // Only update box width when value of isCollasped is false
      if (this.isCollasped) {
        return
      }
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = '100%'
        })
      } else {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = this.minWidth + 'px'
        })
      }
    },
    duringTransitionWidth(newVal) {
      if (!newVal) {
        if (!this.isCollasped) {
          this.myLibWidth = this.$refs.resizeBox.offsetWidth
        }
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.startObserve()
  },
  beforeUnmount() {
    this.stopObserve()
  }
}
</script>
<style lang="scss" scoped>
.my-library {
  background-color: $color-bg-2;
  position: relative;
  border-radius: $border-radius-default;

  transition: width $duration-slow ease;

  &__resize-handle {
    width: $gutter;
    height: 98%;
    position: absolute;
    top: 50%;
    right: calc(0px - $gutter);
    transform: translateY(-50%);
    cursor: grab;
    display: flex;
    justify-content: center;

    &:hover &__line {
      background-color: $color-font-secondary;
    }

    &:active &__line {
      background-color: $color-font-primary;
      cursor: grabbing;
    }

    &:active {
      cursor: grabbing;
    }

    &__line {
      width: 0.1rem;
      height: 100%;
      cursor: grab;

      @include transitionFast;

      &:active {
        cursor: grabbing;
      }
    }
  }
}
</style>
