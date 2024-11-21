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
import { useAppStore } from '@/stores/app'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import { mapWritableState } from 'pinia'

export default {
  name: 'MyOverlayScrollbars',
  components: {
    OverlayScrollbarsComponent
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore'])
  },
  props: {
    osElement: {
      type: String,
      required: true
    }
  },
  methods: {
    onScroll(instance, event) {
      let bottom =
        event.srcElement.scrollHeight -
        Math.ceil(event.srcElement.clientHeight + event.srcElement.scrollTop)
      this.$emit('scroll', bottom)
    }
  }
}
</script>
<style lang="scss" scoped>
.my-overlay-scroll-bar {
  height: inherit;
}
</style>
