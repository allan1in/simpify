<template>
  <button v-tooltip="toolTipLike" @click.prevent="handleClick">
    <IconSaved v-if="saved" />
    <IconAddTo v-else />
  </button>
</template>
<script>
import IconAddTo from '@/components/Icons/IconAddTo.vue'
import IconSaved from '@/components/Icons/IconSaved.vue'
export default {
  name: 'ButtonSave',
  props: {
    saved: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    IconAddTo,
    IconSaved
  },
  computed: {
    toolTipLike() {
      if (this.saved) {
        return this.$t('tooltip.remove_from_library')
      }
      return this.$t('tooltip.add_to_library')
    }
  },
  methods: {
    handleClick() {
      if (this.loading) {
        return
      }
      this.$emit('buttonClick')
    }
  }
}
</script>
<style lang="scss" scoped></style>
