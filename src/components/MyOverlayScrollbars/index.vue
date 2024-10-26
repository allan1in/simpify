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
      /*  When the distance between the scroll bar and the bottom of 
          the track is less than this value, the loading method will 
          be triggered.
      */
      let bottom = 300
      let trigger =
        Math.ceil(event.srcElement.clientHeight + event.srcElement.scrollTop) >=
        event.srcElement.scrollHeight - bottom
      if (trigger) {
        this.loadMore = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.my-overlay-scroll-bar {
  height: inherit;
}
</style>
