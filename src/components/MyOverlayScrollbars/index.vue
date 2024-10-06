<template>
  <OverlayScrollbarsComponent
    :element="osElement"
    :options="{
      scrollbars: {
        theme: 'os-theme-custom',
        autoHide: 'leave',
        clickScroll: true
      }
    }"
    defer
    :class="osClass"
  >
    <slot></slot>
  </OverlayScrollbarsComponent>
</template>

<script>
// https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-vue/README.md#properties
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

export default {
  name: 'MyOverlayScrollbars',
  components: {
    OverlayScrollbarsComponent
  },
  props: {
    osClass: {
      type: String,
      required: false
    },
    osElement: {
      type: String,
      required: true
    }
  }
}
</script>
