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
      'during_library_width_transition',
      'library_width',
      'active_collasped',
      'active_show_more',
      'resizing'
    ])
  },
  methods: {
    handleMouseDown(event) {
      event.preventDefault()
      this.resizing = true

      this.$refs.resizeBox.style.transition = 'none'
      let boxLeft = this.$refs.resizeBox.getBoundingClientRect().left
      let newWidth = event.clientX - boxLeft

      document.onmousemove = (e) => {
        newWidth = e.clientX - boxLeft

        if (newWidth <= this.minWidth) {
          // Change the arrow to point to the right
          this.active_show_more = false

          if (newWidth > this.minWidth / 2) {
            // Open resizable box
            this.library_width = this.minWidth
            this.active_collasped = false
            return
          } else {
            // Close resizable box
            this.active_collasped = true
            return
          }
        }

        // Update new Width
        this.$refs.resizeBox.style.width = newWidth + 'px'

        // Has reached the maximum width
        if (this.$refs.resizeBox.offsetWidth !== newWidth) {
          // Change the arrow to point to the left
          this.active_show_more = true
        }
      }

      document.onmouseup = () => {
        this.resizing = false
        document.onmousemove = null
        document.onmouseup = null
        this.$refs.resizeBox.style.transition = `width ${variables.duration_slow} ease`
        if (!this.active_collasped) {
          this.library_width = newWidth
        }
      }
    },
    onTransitionEnd(event) {
      if (event.propertyName === 'width') {
        this.during_library_width_transition = false
        this.resizing = false
      }
    },
    onTransitionStart(event) {
      if (event.propertyName === 'width') {
        this.during_library_width_transition = true
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
        this.library_width = this.minWidth
        this.$refs.resizeBox.style.width = this.library_width + 'px'
      })
    }
  },
  watch: {
    active_collasped(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = this.collapsedWidth + 'px'
        })
      } else {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = Math.max(this.minWidth, this.library_width) + 'px'
        })
      }
    },
    active_show_more(newVal) {
      // Only update box width when value of active_collasped is false
      if (this.active_collasped) {
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
    during_library_width_transition(newVal) {
      if (!newVal) {
        if (!this.active_collasped) {
          this.library_width = this.$refs.resizeBox.offsetWidth
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
