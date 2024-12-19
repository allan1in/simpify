<template>
  <div class="input-textarea-container">
    <div class="input-textarea-container__input-box">
      <label class="input-textarea-container__input-box__label" for="textarea">{{ label }}</label>
      <textarea
        v-bind="$attrs"
        v-model="textContent"
        name="textarea"
        class="input-textarea-container__input-box__input"
        :placeholder="placeholder"
        @focus="$emit('validate')"
        @focusout="$emit('validate')"
        @input="$emit('validate')"
      ></textarea>
    </div>
    <span v-show="showCount" class="input-textarea-container__count">{{
      `${textContent.length} / ${maxLength}`
    }}</span>
  </div>
</template>
<script>
export default {
  name: 'InputTextArea',
  inheritAttrs: false,
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
  data() {
    return {
      showCount: false
    }
  },
  computed: {
    textContent: {
      get() {
        return this.modelValue
      },
      set(newVal) {
        this.$emit('update:modelValue', newVal)
      }
    },
    maxLength() {
      return this.$attrs.maxlength
    }
  },
  watch: {
    'textContent.length'(newVal) {
      if (this.maxLength && newVal >= Math.floor(this.maxLength * 0.9)) {
        this.showCount = true
      } else {
        this.showCount = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-textarea-container {
  width: 100%;
  height: 100%;
  background-color: $color-bg-6;
  border-radius: $border-radius-small;
  position: relative;

  &:focus-within &__input-box__label {
    opacity: 1;
  }

  &:focus-within {
    background-color: $color-bg-5;
    outline: 0.1rem solid $color-bg-7;
  }

  &:focus-within &__count {
    background-color: $color-bg-5;
  }

  &__input-box {
    width: 100%;
    height: 100%;
    position: relative;

    &__input {
      width: 100%;
      height: 100%;
      background-color: $color-bg-6;
      border-radius: $border-radius-small;
      border: none;
      resize: none;
      padding: $gutter;
      color: $color-font-primary;
      scrollbar-color: $color-bg-7 transparent;

      &:focus-visible,
      &:focus {
        outline: none;
      }

      &:focus {
        background-color: $color-bg-5;
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
      border-radius: $gutter;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: -10%;
        transform: translateY(-50%);
        height: 1rem;
        width: 120%;
        background-color: $color-bg-5;
        z-index: -1;
      }
    }
  }

  &__count {
    position: absolute;
    right: $gutter;
    bottom: $gutter;
    padding: 0.4rem;
    color: $color-font-secondary;
    font-size: $font-size-text-tertiary;
    background-color: $color-bg-6;
    border-radius: $border-radius-small;
    opacity: 0.8;
  }
}
</style>
