<template>
  <OverlayScrollbarsComponent
    @os-scroll="onScroll"
    :element="osElement"
    :options="{
      scrollbars: {
        theme: 'os-theme-custom',
        autoHide: 'leave',
        clickScroll: true
      }
    }"
    defer
    class="my-overlay-scroll-bar"
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
    osElement: {
      type: String,
      required: true
    }
  },
  methods: {
    onScroll(instance, event) {
      console.log(
        event.srcElement.clientHeight + event.srcElement.scrollTop >=
          event.srcElement.scrollHeight - 100
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.my-overlay-scroll-bar {
  height: inherit;
}
</style>
