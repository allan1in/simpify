<template>
  <div
    class="tooltip-container"
    ref="triggerWrapper"
    @click.prevent="hideImmediate"
    @mouseover="handleMouseEnter"
    @mouseout="handleMouseLeave"
  >
    <slot></slot>

    <Teleport to="body">
      <Transition :name="transitionName" @after-leave="handleAfterLeave">
        <div
          v-if="!disable && visible"
          ref="toolTip"
          class="tooltip-container__tooltip"
          :style="tooltipStyle"
        >
          {{ content }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script>
export default {
  name: 'ToolTip',
  data() {
    return {
      visible: false,
      tooltipStyle: {},
      timer: undefined,
      transitionName: 'fade',
      content: undefined,
      delay: 600
    }
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top'
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleMouseEnter() {
      if (!this.visible) {
        this.timer = setTimeout(() => {
          this.showTooltip()
        }, this.delay)
      }
    },
    handleMouseLeave() {
      clearTimeout(this.timer)
      if (this.visible) {
        this.visible = false
      }
    },
    showTooltip() {
      if (this.disable || this.visible) {
        return
      }

      this.visible = true

      const rect = this.$refs.triggerWrapper.getBoundingClientRect()
      const clientWidth = document.documentElement.offsetWidth
      const clientHeight = document.documentElement.offsetHeight
      let top,
        left = 'auto'
      let translate = 'unset'
      const gutter = 8

      // Make sure to get the offsetHeight after DOM rendering is complete
      this.$nextTick(() => {
        const toolTipWidth = this.$refs.toolTip.offsetWidth
        const toolTipHeight = this.$refs.toolTip.offsetHeight

        switch (this.position) {
          case 'top': {
            top = rect.top - toolTipHeight - gutter
            if (top < 0) {
              top = rect.bottom + gutter
            }

            left = rect.left + rect.width / 2
            if (left - toolTipWidth / 2 < 0) {
              left = gutter
            } else if (left + toolTipWidth / 2 > clientWidth) {
              left = clientWidth - toolTipWidth - gutter
            } else {
              translate = 'translateX(-50%)'
            }

            break
          }
          case 'bottom': {
            top = rect.bottom + gutter
            if (top > clientHeight) {
              top = clientHeight - gutter
            }

            left = rect.left + rect.width / 2
            if (left - toolTipWidth / 2 < 0) {
              left = gutter
            } else if (left + toolTipWidth / 2 > clientWidth) {
              left = clientWidth - toolTipWidth - gutter
            } else {
              translate = 'translateX(-50%)'
            }
            break
          }
          case 'right': {
            top = rect.top + rect.height / 2
            if (top < 0) {
              top = gutter
            } else if (top > clientHeight) {
              top = clientHeight - toolTipHeight - gutter
            }

            left = rect.right + gutter
            if (left + toolTipWidth / 2 > clientWidth) {
              left = rect.left - toolTipWidth - gutter
            } else {
              translate = 'translateY(-50%)'
            }

            break
          }
          case 'left': {
            top = rect.top + rect.height / 2
            if (top < 0) {
              top = gutter
            } else if (top > clientHeight) {
              top = clientHeight - toolTipHeight - gutter
            }

            left = rect.left - toolTipWidth - gutter
            if (left - toolTipWidth / 2 < 0) {
              left = rect.right + gutter
            } else {
              translate = 'translateY(-50%)'
            }

            break
          }
        }
        this.tooltipStyle = {
          position: 'absolute',
          top: top + 'px',
          left: left + 'px',
          transform: translate
        }
      })
    },
    hideImmediate() {
      if (this.visible) {
        this.transitionName = ''
        this.visible = false
      }
    },
    handleAfterLeave() {
      this.transitionName = 'fade'
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        this.content = this.text
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip-container {
  &__tooltip {
    background-color: $color-bg-4;
    border-radius: $border-radius-small;
    width: max-content;
    font-size: $font-size-text-secondary;
    padding: 0.4rem 1rem;
    z-index: 99999;
    box-shadow: 0 0 1rem 0.5rem rgba($color-bg-1, 0.6);
  }
}
</style>
