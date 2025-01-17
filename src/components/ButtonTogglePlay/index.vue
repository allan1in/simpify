<template>
  <button
    v-tooltip="toolTipState"
    class="button-toggle-play-container"
    @click.prevent.stop="handleClick"
  >
    <div class="button-toggle-play-container__icon-wrapper">
      <IconPause v-if="isPlaying" />
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
    ...mapWritableState(usePlayerStore, [
      'context',
      'current_track',
      'active_pause',
      'activeDevice'
    ]),
    isPlaying() {
      return !this.active_pause && this.isCurrent
    },
    isCurrent() {
      if (this.item.type === 'track') {
        return this.item?.uri === this.current_track?.uri
      }
      return this.item?.uri === this.context?.uri
    },
    toolTipState() {
      return this.isPlaying ? this.$t('tooltip.pause') : this.$t('tooltip.play')
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['togglePlay', 'playNewContext', 'playNewTrack']),
    ...mapActions(useUserStore, ['checkProduct']),
    async handleClick() {
      if (this.isCurrent) {
        this.togglePlay()
      } else {
        if (this.item.type === 'track') {
          this.playNewTrack({ uris: [this.item?.uri] })
        } else {
          this.playNewContext({ context_uri: this.item?.uri })
        }
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
  overflow: hidden;
  position: relative;
  cursor: pointer;

  @include clickAnimation;

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
