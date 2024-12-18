<template>
  <Transition name="fade">
    <div v-if="visible" ref="tooltip" class="tooltip-container" :style="positionStyle">
      {{ content }}
    </div>
  </Transition>
</template>
<script>
export default {
  name: 'ToolTip',
  data() {
    return {
      visible: false,
      content: '',
      rect: undefined,
      placement: '',
      timer: undefined,
      gutter: 8,
      tooltipSize: {
        height: 0,
        width: 0
      }
    }
  },
  computed: {
    positionStyle() {
      let top = 0
      let left = 0
      let transform = 'none'
      const maxWidth = window.innerWidth
      const maxHeight = window.innerHeight

      switch (this.placement) {
        case 'top': {
          top = this.rect.top - this.gutter - this.tooltipSize.height
          left = this.rect.left + this.rect.width / 2 - this.tooltipSize.width / 2

          if (left < 0) {
            left = this.gutter
          } else if (left + this.tooltipSize.width + this.gutter > maxWidth) {
            left = maxWidth - this.gutter - this.tooltipSize.width
          }
          if (top < 0) {
            top = this.rect.bottom + this.gutter
          }

          break
        }
        case 'bottom': {
          top = this.rect.bottom + this.gutter
          left = this.rect.left + this.rect.width / 2 - this.tooltipSize.width / 2

          if (left < 0) {
            left = this.gutter
          } else if (left + this.tooltipSize.width + this.gutter > maxWidth) {
            left = maxWidth - this.gutter - this.tooltipSize.width
          }
          if (top - this.gutter - this.tooltipSize.height > maxHeight) {
            top = this.rect.top - this.gutter - this.tooltipSize.height
          }

          break
        }
        case 'left': {
          top = this.rect.top + this.rect.height / 2 - this.tooltipSize.height / 2
          left = this.rect.left - this.gutter - this.tooltipSize.width

          if (top - this.gutter - this.tooltipSize.height < 0) {
            top = maxHeight - this.gutter - this.tooltipSize.height
          } else if (top > maxHeight) {
            top = this.gutter
          }
          if (left < 0) {
            left = this.rect.right + this.gutter
          }

          break
        }
        case 'right': {
          top = this.rect.top + this.rect.height / 2 - this.tooltipSize.height / 2
          left = this.rect.right + this.gutter

          if (top - this.gutter - this.tooltipSize.height < 0) {
            top = maxHeight - this.gutter - this.tooltipSize.height
          } else if (top > maxHeight) {
            top = this.gutter
          }
          if (left + this.tooltipSize.width + this.gutter > maxWidth) {
            left = this.rect.left - this.gutter - this.tooltipSize.width
          }

          break
        }
      }

      return {
        left: `${left}px`,
        top: `${top}px`,
        transform
      }
    }
  },
  methods: {
    show() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.visible = true
        this.$nextTick(() => {
          this.tooltipSize = {
            width: this.$refs.tooltip.offsetWidth,
            height: this.$refs.tooltip.offsetHeight
          }
        })
      }, 600)
    },
    hide() {
      clearTimeout(this.timer)
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip-container {
  position: absolute;
  background-color: $color-bg-4;
  border-radius: $border-radius-small;
  width: max-content;
  font-size: $font-size-text-secondary;
  padding: 0.4rem 1rem;
  z-index: 99999;
  box-shadow: 0 0 1rem 0.5rem rgba($color-bg-1, 0.4);
}
</style>
