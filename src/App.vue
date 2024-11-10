<template>
  <main class="app-container">
    <RouterView />
    <FullScreenPlayer />
  </main>
</template>
<script>
import FullScreenPlayer from '@/components/FullScreenPlayer/index.vue'

export default {
  name: 'App',
  components: {
    FullScreenPlayer
  }
}
</script>
<style lang="scss" scoped></style>
