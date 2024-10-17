<template>
  <div v-if="loading" class="loading-wrapper">
    <IconLoading />
  </div>
</template>

<script>
import IconLoading from '../Icons/IconLoading.vue'

export default {
  name: 'Loading',
  props: {
    loading: {
      type: Boolean,
      require: true
    }
  },
  components: {
    IconLoading
  }
}
</script>

<style lang="scss" scoped>
.loading-wrapper {
  min-height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
