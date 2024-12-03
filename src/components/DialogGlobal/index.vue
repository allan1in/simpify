<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        ref="dialogContainer"
        class="dialog-global-container"
        v-if="modelValue"
        @click="handleClickContainer"
      >
        <div class="dialog-global-container__box" v-bind="$attrs">
          <div class="loading-cover" :class="{ 'loading-cover-active': loading }">
            <IconLoading />
          </div>
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script>
import IconLoading from '../Icons/IconLoading.vue'

export default {
  name: 'DialogGlobal',
  props: {
    modelValue: {},
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    IconLoading
  },
  inheritAttrs: false,
  methods: {
    handleClickContainer(event) {
      if (!this.loading && event.target === this.$refs.dialogContainer) {
        this.$emit('clickOutside')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color-bg-1, 0.5);
  z-index: -1;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @include transition;

  &-active:nth-child(n) {
    z-index: 1;
    opacity: 1;
  }
}

.dialog-global-container {
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba($color-bg-1, 0.5);

  &__box {
    position: fixed;
    z-index: 999999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60rem;
    height: unset;
    margin: 0 auto;
    background-color: $color-bg-4;
    border-radius: $border-radius-default;
    overflow: hidden;
    padding: $gutter-3x;
  }
}
</style>
