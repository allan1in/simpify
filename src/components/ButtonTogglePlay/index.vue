<template>
  <button class="button-toggle-play-container" @click.stop="handleClick">
    <div class="button-toggle-play-container__icon-wrapper">
      <IconPause v-if="item.uri === context?.uri && !isPause" />
      <IconPlay v-else />
    </div>
  </button>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import IconPause from '../Icons/IconPause.vue'
import IconPlay from '../Icons/IconPlay.vue'
import { usePlayerStore } from '@/stores/player'

export default {
  name: 'ButtonTogglePlay',
  components: {
    IconPause,
    IconPlay
  },
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  computed: {
    ...mapWritableState(usePlayerStore, ['context', 'isPause', 'activeDevice', 'playNewContext'])
  },
  methods: {
    ...mapActions(usePlayerStore, ['togglePlay']),
    async handleClick() {
      if (this.item.uri === this.context.uri) {
        this.togglePlay()
      } else {
        this.playNewContext({ context_uri: this.item.uri })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button-toggle-play-container {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  box-shadow: 0 0.5rem 1rem 1rem rgba($color-bg-3, 0.3);
  background-color: $color-brand;
  display: flex;
  align-items: center;
  justify-content: center;
  @include clickAnimation;

  &__icon-wrapper {
    height: 40%;
    width: 40%;
    fill: $color-bg-1;
  }
}
</style>
