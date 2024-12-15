<template>
  <div class="volume-container">
    <button
      v-tooltip="toolTipMute"
      class="icon-wrapper"
      @click="handleMuteClick"
      :class="{ 'not-allowed': disabled }"
      :disabled="disabled"
    >
      <IconVolumeMuted v-if="isMute || volume == 0" />
      <IconVolumeQuiet v-else-if="volume <= 33" />
      <IconVolumeNormal v-else-if="volume <= 66" />
      <IconVolumeLoud v-else />
    </button>
    <div class="volume-container__progress-wrapper">
      <ProcessBar
        :percentage="isMute ? 0 : volume"
        @update-percentage="updateVolume"
        @mouse-down="handleMouseDown"
        :disabled="disabled"
      />
    </div>
  </div>
</template>
<script>
import ProcessBar from '@/components/ProcessBar/index.vue'
import IconVolumeLoud from '../Icons/IconVolumeLoud.vue'
import IconVolumeNormal from '../Icons/IconVolumeNormal.vue'
import IconVolumeQuiet from '../Icons/IconVolumeQuiet.vue'
import IconVolumeMuted from '../Icons/IconVolumeMuted.vue'
import { mapActions, mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'

export default {
  name: 'VolumeBar',
  components: {
    ProcessBar,
    IconVolumeLoud,
    IconVolumeNormal,
    IconVolumeQuiet,
    IconVolumeMuted
  },
  computed: {
    ...mapWritableState(usePlayerStore, ['isMute', 'volume']),
    toolTipMute() {
      if (this.isMute) {
        return this.$t('tooltip.unmute')
      }
      return this.$t('tooltip.mute')
    }
  },
  props: {
    disabled: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  data() {
    return {
      tooltip: {
        mute: {
          text: undefined
        }
      }
    }
  },
  methods: {
    async updateVolume(newVal) {
      this.volume = newVal
      await this.setVolume()
    },
    async handleMouseDown() {
      if (this.isMute) {
        this.isMute = false
      }
    },
    handleMuteClick() {
      if (this.volume === 0) {
        this.volume = 25
      }
      this.isMute = !this.isMute
    },
    ...mapActions(usePlayerStore, ['setVolume', 'setMute'])
  },
  watch: {
    volume(newVal, oldVal) {
      if (newVal === 0) {
        this.isMute = true
      } else {
        this.isMute = false
      }
    },
    isMute(newVal) {
      if (newVal) {
        this.setMute()
      } else {
        this.setVolume()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.not-allowed:nth-child(n) {
  cursor: not-allowed;
  opacity: 0.3;

  &:hover {
    transform: unset;
    fill: $color-font-secondary;
  }

  &:active {
    transform: unset;
    opacity: 0.3;
    fill: $color-font-secondary;
  }
}

.icon-wrapper {
  display: inline-block;
  fill: $color-font-secondary;
  height: 3.2rem;
  width: 3.2rem;
  padding: $gutter;

  &:hover {
    fill: $color-font-primary;
  }

  &:active {
    fill: $color-font-primary;
  }

  @include clickAnimation;
}

.volume-container {
  margin-right: $gutter;
  display: flex;
  align-items: center;

  &__progress-wrapper {
    width: 9.3rem;
  }
}
</style>
