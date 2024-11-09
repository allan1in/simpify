<template>
  <main class="app-container">
    <RouterView />
    <Transition name="fade">
      <FullScreenPlayer v-show="showFullScreenPlayer" />
    </Transition>
  </main>
</template>
<script>
import FullScreenPlayer from '@/components/FullScreenPlayer/index.vue'
import { mapWritableState } from 'pinia'
import { usePlayerStore } from './stores/player'

export default {
  name: 'App',
  components: {
    FullScreenPlayer
  },
  computed: {
    ...mapWritableState(usePlayerStore, ['showFullScreenPlayer'])
  }
}
</script>
<style lang="scss" scoped></style>
