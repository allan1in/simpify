<template>
    <button class="button-follow" @click="handleClick">
        {{ isFollowed ? $t('artist.following') : $t('artist.follow') }}
    </button>
</template>
<script>
export default {
    name: 'ButtonFollow',
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        isFollowed: {
            type: Boolean,
            require: true
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
<style lang="scss" scoped>
.button-follow {
    border: 1px solid $color-bg-7;
    padding: 0 $gutter-2x;
    height: 3.2rem;
    font-size: $font-size-text-secondary;
    font-weight: 700;
    border-radius: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @include clickAnimation;

    &:hover {
        border-color: $color-font-primary;
    }

    &:active {
        border-color: $color-bg-7;
    }
}
</style>