<template>
  <button
    class="button-toggle-play-container"
    :class="{ available: available }"
    @click.stop.prevent="handleClick"
  >
    <div class="button-toggle-play-container__icon-wrapper">
      <IconPause v-if="showIconPause" />
      <IconPlay v-else />
    </div>
  </button>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import IconPause from '../Icons/IconPause.vue'
import IconPlay from '../Icons/IconPlay.vue'
import { usePlayerStore } from '@/stores/player'
import { useUserStore } from '@/stores/user'

export default {
  name: 'ButtonTogglePlay',
  components: {
    IconPause,
    IconPlay
  },
  props: {
    item: {
      type: Object
    }
  },
  computed: {
    ...mapWritableState(usePlayerStore, ['context', 'isPause', 'activeDevice', 'playNewContext']),
    available() {
      return this.checkProduct('premium')
    },
    showIconPause() {
      return this.item?.uri === this.context?.uri && !this.isPause
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['togglePlay']),
    ...mapActions(useUserStore, ['checkProduct']),
    async handleClick() {
      if (this.item?.uri === this.context?.uri) {
        this.togglePlay()
      } else {
        this.playNewContext({ context_uri: this.item?.uri })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.available:nth-child(n) {
  cursor: pointer;

  @include clickAnimation;
}

.button-toggle-play-container {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  box-shadow: 0 0.5rem 1rem 1rem rgba($color-bg-3, 0.3);
  background-color: $color-brand;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  cursor: not-allowed;

  &:hover ::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color-font-primary, 0.2);
  }

  &__icon-wrapper {
    height: 40%;
    width: 40%;
    fill: $color-bg-1;
  }
}
</style>
