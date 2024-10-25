<template>
  <div class="seek-bar" :class="{ 'seek-bar-large': size === 'large', 'seek-bar-default': size === 'default' }">
    <div class="seek-bar__seek">{{ seek }}</div>
    <div class="seek-bar__process-bar">
      <ProcessBar :percentage="percentage" @update="updatePercentage" />
    </div>
    <div class="seek-bar__duration">{{ duration }}</div>
  </div>
</template>

<script>
import ProcessBar from '@/components/ProcessBar/index.vue'
import { useTrackStore } from '@/stores/track'
import { mapWritableState } from 'pinia'

export default {
  name: 'SeekBar',
  props: {
    size: {
      type: String,
      require: false,
      default: 'default'
    }
  },
  components: {
    ProcessBar
  },
  computed: {
    ...mapWritableState(useTrackStore, ['percentage', 'seek', 'duration'])
  },
  methods: {
    updatePercentage(newVal) {
      this.percentage = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.seek-bar {
  display: flex;
  justify-content: space-between;
  gap: $gutter;
  color: $color-font-secondary;
  align-items: center;

  &-default {
    font-size: 1.2rem;
  }

  &-large {
    font-size: 1.8rem;
  }

  &__seek {
    text-align: right;
  }

  &__process-bar {
    margin: 0 1%;
    width: 100%;
  }

  &__duration {
    text-align: left;
  }

}
</style>
