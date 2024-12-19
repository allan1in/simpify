<template>
  <Transition name="fade-slide-from-bottom" @after-leave="onAfterLeave">
    <div class="message-container" v-show="visible">
      <span class="message-container__content">{{ config.content }}</span>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
      visible: false
    }
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    remove: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    open(config) {
      setTimeout(() => {
        this.visible = true
      }, 0)

      // Remove message after duration
      if (config.duration) {
        setTimeout(() => {
          this.visible = false
        }, config.duration)
      }
    },
    onAfterLeave() {
      this.remove()
    }
  },
  created() {
    this.open(this.config)
  }
}
</script>

<style lang="scss" scoped>
.message-container {
  background-color: $color-font-primary;
  padding: $gutter-1-5x;
  border-radius: $gutter;

  &__content {
    color: $color-bg-1;
    font-size: $font-size-text-primary;
    font-weight: 700;
    user-select: none;
  }
}
</style>
