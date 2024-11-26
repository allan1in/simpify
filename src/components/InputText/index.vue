<template>
  <div class="input-text-container">
    <label class="input-text-container__label" for="textarea">{{ label }}</label>
    <input
      v-model="textContent"
      type="text"
      class="input-text-container__input"
      :placeholder="placeholder"
      @focusout="$emit('validate')"
    />
  </div>
</template>
<script>
export default {
  name: 'InputText',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {}
  },
  computed: {
    textContent: {
      get() {
        return this.modelValue
      },
      set(newVal) {
        this.$emit('update:modelValue', newVal)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-text-container {
  width: 100%;
  height: 100%;
  position: relative;

  &:focus-within &__label {
    opacity: 1;
  }

  &__input {
    width: 100%;
    height: 100%;
    background-color: $color-bg-6;
    border-radius: $border-radius-small;
    border: none;
    resize: none;
    padding: $gutter;
    color: $color-font-primary;

    &:focus-visible,
    &:focus {
      outline: none;
    }

    &:focus {
      background-color: $color-bg-5;
      outline: 0.1rem solid $color-bg-7;
    }

    &:focus + .input-textarea-container__label {
      opacity: 1;
    }
  }

  &__label {
    font-size: $font-size-text-tertiary;
    font-weight: 700;
    color: $color-font-secondary;
    position: absolute;
    top: calc(0px - calc($font-size-text-tertiary * 0.5));
    left: 1rem;
    line-height: 1;
    z-index: 0;
    opacity: 0;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -10%;
      transform: translateY(-50%);
      height: 0.1rem;
      width: 120%;
      background-color: $color-bg-5;
      z-index: -1;
    }
  }
}
</style>
