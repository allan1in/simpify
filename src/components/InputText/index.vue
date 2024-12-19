<template>
  <div class="input-text-container">
    <div class="input-text-container__input-box">
      <label class="input-text-container__input-box__label" for="textarea">{{ label }}</label>
      <input
        v-bind="$attrs"
        v-model="textContent"
        type="text"
        class="input-text-container__input-box__input"
        :placeholder="placeholder"
        @focusout="$emit('validate')"
        @input="$emit('validate')"
      />
    </div>
    <span v-show="showCount" class="input-text-container__count">{{
      `${textContent.length} / ${maxLength}`
    }}</span>
  </div>
</template>
<script>
export default {
  name: 'InputText',
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
.input-text-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: $color-bg-6;
  border-radius: $border-radius-small;

  &:focus-within &__input-box__label {
    opacity: 1;
  }

  &:focus-within {
    background-color: $color-bg-5;
    outline: 0.1rem solid $color-bg-7;
  }

  &__input-box {
    flex: 1;
    width: 100%;
    height: 100%;
    position: relative;

    &__input {
      width: 100%;
      height: 100%;
      background-color: $color-bg-6;
      border: none;
      resize: none;
      padding: $gutter;
      color: $color-font-primary;
      border-radius: $border-radius-small;

      &:focus-visible,
      &:focus {
        outline: none;
      }

      &:focus {
        background-color: $color-bg-5;
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

  &__count {
    padding-right: $gutter;
    color: $color-font-secondary;
    font-size: $font-size-text-tertiary;
  }
}
</style>
