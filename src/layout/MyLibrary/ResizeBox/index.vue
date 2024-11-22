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

export default {
  name: 'ResizeBox',
  data() {
    return {
      minWidth: 280,
      collapsedWidth: 72
    }
  },
  computed: {
    ...mapWritableState(useLibraryStore, ['myLibWidth', 'isCollasped', 'isShowMore'])
  },
  methods: {
    handleMouseDown(event) {
      event.preventDefault()

      let boxLeft = this.$refs.resizeBox.getBoundingClientRect().left
      let newWidth

      document.onmousemove = (e) => {
        newWidth = e.clientX - boxLeft

        if (newWidth <= this.minWidth) {
          // Change the arrow to point to the right
          this.isShowMore = false

          if (newWidth > this.minWidth / 2) {
            // Open resizable box
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
        this.myLibWidth = newWidth

        // Has reached the maximum width
        if (this.$refs.resizeBox.offsetWidth !== newWidth) {
          // Change the arrow to point to the left
          this.isShowMore = true
        }
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
  watch: {
    isCollasped(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = this.collapsedWidth + 'px'
        })
      } else {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = this.myLibWidth + 'px'
        })
      }
    },
    isShowMore(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = '100%'
          this.myLibWidth = this.$refs.resizeBox.offsetWidth
        })
      } else {
        this.$nextTick(() => {
          this.$refs.resizeBox.style.width = this.minWidth + 'px'
          this.myLibWidth = this.minWidth
        })
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.myLibWidth = this.minWidth
      this.$refs.resizeBox.style.width = this.myLibWidth + 'px'

      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (entry.target.offsetWidth < this.minWidth) {
            this.isCollasped = true
          }
        }
      });
      resizeObserver.observe(this.$refs.resizeBox);
    })
  }
}
</script>
<style lang="scss" scoped>
.my-library {
  background-color: $color-bg-2;
  border-radius: $border-radius-default;
  position: relative;

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
