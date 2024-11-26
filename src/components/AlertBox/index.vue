<template>
    <div class="alert-box-container" :class="typeClass">
        <div class="alert-box-container__icon-wrapper">
            <IconWarning />
        </div>
        <div class="alert-box-container__text">
            {{ value }}
        </div>
    </div>
</template>
<script>
import IconWarning from '../Icons/IconWarning.vue';

export default {
    name: 'AlertBox',
    props: {
        type: {
            type: String,
            default: 'info'
        },
        value: {
            type: String,
            default: ''
        }
    },
    components: {
        IconWarning
    },
    computed: {
        typeClass() {
            return {
                info: this.type === 'info',
                warn: this.type === 'warn'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.alert-box-container {
    width: 100%;
    padding: $gutter;
    display: flex;
    align-items: center;
    gap: $gutter;
    border-radius: $border-radius-small;

    &__icon-wrapper {
        height: $font-size-text-primary;
        aspect-ratio: 1 / 1;
        fill: $color-font-primary;
    }

    &__text {
        font-size: $font-size-text-secondary;

        @include oneLineEllipsis;
    }
}

.info {
    background-color: $color-bg-7;
}

.warn {
    background-color: $color-warn;
}
</style>