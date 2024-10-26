<template>
  <MyOverlayScrollbars os-element="main">
    <div class="container">
      <div class="container__content" v-show="!loading">
        <slot></slot>
      </div>
      <Loading :loading="loading" />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Search',
  components: {
    MyOverlayScrollbars,
    Loading
  },
  computed: {
    ...mapState(useAppStore, ['loading'])
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: $height-content;

  &__content {
    max-width: $max-width-main-view;
    margin: 0 auto;
  }
}
</style>
