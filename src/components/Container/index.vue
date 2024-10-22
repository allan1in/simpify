<template>
  <MyOverlayScrollbars os-element="main" @load-more="$emit('loadMore')">
    <div class="container">
      <div v-if="!loading">
        <slot></slot>
      </div>
      <Loading :loading="loading" />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'Search',
  components: {
    MyOverlayScrollbars,
    Loading
  },
  props: {
    loading: {
      type: Boolean,
      require: true,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: $height-content;
}
</style>
