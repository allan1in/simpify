<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="openDialog" class="confirm-box-container">
        <div class="confirm-box-container__box">
          <div class="confirm-box-container__box__title">
            {{ title }}
          </div>
          <div class="confirm-box-container__box__message">
            {{ message }}
          </div>
          <div class="confirm-box-container__box__button-group">
            <button class="confirm-box-container__box__button-group__cancel" @click="openDialog = false">
              {{ $t('confirm_box.cancel') }}
            </button>
            <button class="confirm-box-container__box__button-group__confirm" @click="$emit('confirm')">
              {{ $t('confirm_box.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script>
export default {
  name: 'ConfirmBox',
  emits: ['confirm', 'update:modelValue'],
  props: {
    modelValue: {},
    title: {
      type: String,
      default: '123'
    },
    message: {
      type: String,
      default: '123'
    }
  },
  computed: {
    // https://vuejs.org/guide/components/v-model.html
    openDialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm-box-container {
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba($color-bg-1, 0.5);
  backdrop-filter: blur(1rem);

  &__box {
    position: fixed;
    z-index: 999999;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50rem;
    margin: 0 auto;
    overflow: hidden;
    background-color: $color-font-primary;
    padding: $gutter-3x;
    display: flex;
    flex-direction: column;
    gap: $gutter;
    border-radius: $border-radius-default;

    &__title {
      font-size: $font-size-title-primary;
      color: $color-bg-1;
      font-weight: 700;
    }

    &__message {
      color: $color-bg-1;
      font-size: $font-size-text-secondary;
    }

    &__button-group {
      display: flex;
      justify-content: end;
      gap: $gutter;

      &__cancel {
        color: $color-bg-1;
        border-radius: 99999rem;
        height: max-content;
        padding: $gutter-2x $gutter-4x;
        font-size: $font-size-text-primary;
        font-weight: 700;

        @include clickAnimation;
      }

      &__confirm {
        color: $color-bg-1;
        background-color: $color-brand;
        border-radius: 99999rem;
        height: max-content;
        padding: $gutter-2x $gutter-4x;
        font-size: $font-size-text-primary;
        font-weight: 700;

        @include clickAnimation;
      }
    }
  }
}
</style>
