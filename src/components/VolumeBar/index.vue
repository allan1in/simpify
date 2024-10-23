<template>
    <div class="volume-container">
        <button class="icon-wrapper" @click="$emit('mute')">
            <IconVolumeMuted v-if="isMute || volume == 0" />
            <IconVolumeQuiet v-else-if="volume <= 33" />
            <IconVolumeNormal v-else-if="volume <= 66" />
            <IconVolumeLoud v-else />
        </button>
        <div class="volume-container__progress-wrapper">
            <ProcessBar :percentage="isMute ? 0 : volume" />
        </div>
    </div>
</template>
<script>
import ProcessBar from '@/components/ProcessBar/index.vue'
import IconVolumeLoud from '../Icons/IconVolumeLoud.vue';
import IconVolumeNormal from '../Icons/IconVolumeNormal.vue';
import IconVolumeQuiet from '../Icons/IconVolumeQuiet.vue';
import IconVolumeMuted from '../Icons/IconVolumeMuted.vue';

export default {
    name: 'VolumeBar',
    props: {
        isMute: {
            type: Boolean,
            require: true
        },
        volume: {
            type: Number,
            require: true
        }
    },
    components: {
        ProcessBar,
        IconVolumeLoud,
        IconVolumeNormal,
        IconVolumeQuiet,
        IconVolumeMuted
    }
}
</script>
<style lang="scss" scoped>
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