<template>
    <button v-tooltip="toolTipLike" @click.prevent="$emit('buttonClick')">
        <IconSaved v-if="isSaved" />
        <IconAddTo v-else />
    </button>
</template>
<script>
import IconAddTo from '@/components/Icons/IconAddTo.vue'
import IconSaved from '@/components/Icons/IconSaved.vue'
export default {
    name: 'ButtonSave',
    props: {
        isSaved: {
            type: Boolean,
            required: true
        }
    },
    components: {
        IconAddTo,
        IconSaved
    },
    computed: {
        toolTipLike() {
            if (this.isSaved) {
                return this.$t('tooltip.remove_from_liked_songs')
            }
            return this.$t('tooltip.add_to_liked_songs')
        }
    }
}
</script>
<style lang="scss" scoped></style>