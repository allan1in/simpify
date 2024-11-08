<template>
  <li>
    <router-link v-if="to !== null" :to="to" class="drop-down-item-container" :class="{ 'top-line': topLine }">
      <span class="drop-down-item-container__text-wrapper">
        <slot></slot>
      </span>
    </router-link>
    <a v-else-if="toExternal !== ''" :href="toExternal" target="_blank" class="drop-down-item-container"
      :class="{ 'top-line': topLine }">
      <span class="drop-down-item-container__text-wrapper">
        <slot></slot>
      </span>
      <span class="drop-down-item-container__icon-wrapper">
        <IconExternalLink />
      </span>
    </a>
    <button v-else class="drop-down-item-container" :class="{ 'top-line': topLine }">
      <span class="drop-down-item-container__text-wrapper">
        <slot></slot>
      </span>
    </button>
  </li>
</template>

<script>
import IconExternalLink from '@/components/Icons/IconExternalLink.vue'

export default {
  name: 'DropDownItem',
  props: {
    topLine: {
      type: Boolean,
      require: false,
      default: false
    },
    toExternal: {
      type: String,
      require: false,
      default: ''
    },
    to: {
      type: Object,
      require: false,
      default: null
    }
  },
  components: {
    IconExternalLink
  }
}
</script>

<style lang="scss" scoped>
.top-line:nth-child(n) {
  border-top: 1px solid $color-bg-6;
  padding-top: 1.1rem;
}

.drop-down-item-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: $font-size-text-secondary;
  padding: 1.2rem 0.8rem 1.2rem 1.2rem;
  cursor: pointer;

  &:hover {
    background-color: $color-bg-6;
    text-decoration: underline;
  }

  &__text-wrapper {
    margin-right: 2.4rem;
  }

  &__icon-wrapper {
    height: calc($font-size-text-secondary + 0.2rem);
    width: calc($font-size-text-secondary + 0.2rem);
    fill: $color-font-primary;
    display: flex;
    align-items: center;
  }
}
</style>
