<template>
  <div
    class="seek-bar"
    :class="{ 'seek-bar-large': size === 'large', 'seek-bar-default': size === 'default' }"
  >
    <div class="seek-bar__seek" :class="{ disabled: disabled }">{{ timeFormat(position) }}</div>
    <div class="seek-bar__process-bar">
      <ProcessBar
        :percentage="percentage"
        @update-percentage="updatePercentage"
        @mouse-up="handleMouseUp"
        @mouse-down="handleMouseDown"
        :disabled="disabled"
      />
    </div>
    <div class="seek-bar__duration" :class="{ disabled: disabled }">{{ timeFormat(duration) }}</div>
  </div>
</template>

<script>
import ProcessBar from '@/components/ProcessBar/index.vue'
import { mapActions, mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { timeFormatTrack } from '@/utils/time_format'

export default {
  name: 'SeekBar',
  props: {
    size: {
      type: String,
      require: false,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  components: {
    ProcessBar
  },
  computed: {
    ...mapWritableState(usePlayerStore, [
      'percentage',
      'position',
      'duration',
      'player',
      'duration',
      'isPause'
    ])
  },
  methods: {
    updatePercentage(newVal) {
      this.percentage = newVal
    },
    timeFormat(time) {
      return timeFormatTrack(time)
    },
    async handleMouseUp() {
      this.seekPosition()
    },
    handleMouseDown() {
      this.stopListenPos()
    },
    ...mapActions(usePlayerStore, ['startListenPos', 'stopListenPos', 'seekPosition'])
  },
  watch: {
    percentage(newVal, oldVal) {
      this.position = (this.duration * this.percentage) / 100
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  opacity: 0.3;
}

.seek-bar {
  display: flex;
  justify-content: space-between;
  gap: $gutter;
  color: $color-font-secondary;
  align-items: center;

  &-default {
    font-size: 1.4rem;
  }

  &-large {
    font-size: 1.8rem;
  }

  &__seek {
    min-width: 3.2rem;
    text-align: center;
  }

  &__process-bar {
    margin: 0 1%;
    width: 100%;
  }

  &__duration {
    min-width: 3.6rem;
    text-align: left;
  }
}
</style>
