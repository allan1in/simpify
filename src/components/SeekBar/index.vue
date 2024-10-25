<template>
  <div class="seek-bar" :class="{ 'seek-bar-large': size === 'large', 'seek-bar-default': size === 'default' }">
    <div class="seek-bar__seek">{{ seek }}</div>
    <div class="seek-bar__process-bar">
      <ProcessBar :percentage="percentage" @update-percentage="updatePercentage" />
    </div>
    <div class="seek-bar__duration">{{ duration }}</div>
  </div>
</template>

<script>
import ProcessBar from '@/components/ProcessBar/index.vue'
import { mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'

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
    ...mapWritableState(usePlayerStore, ['percentage', 'seek', 'duration'])
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
    min-width: 3.6rem;
    text-align: right;
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
