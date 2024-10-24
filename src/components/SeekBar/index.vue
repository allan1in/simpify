<template>
  <div class="seek-bar">
    <div class="seek-bar__seek">-:--</div>
    <ProcessBar :percentage="percentage" @update="updatePercentage" />
    <div class="seek-bar__duration">-:--</div>
  </div>
</template>

<script>
import ProcessBar from '@/components/ProcessBar/index.vue'
import { useTrackStore } from '@/stores/track'
import { mapWritableState } from 'pinia'

export default {
  name: 'SeekBar',
  components: {
    ProcessBar
  },
  computed: {
    ...mapWritableState(useTrackStore, ['percentage'])
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
  gap: $gutter;
  font-size: 1.2rem;
  color: $color-font-secondary;
  align-items: center;

  &__seek {
    min-width: 4rem;
    text-align: right;
  }

  &__duration {
    min-width: 4rem;
    text-align: left;
  }
}
</style>
