<template>
    <div class="input-text-container">
        <label class="input-text-container__label" for="textarea">{{ label }}</label>
        <input type="text" class="input-text-container__input" :placeholder="placeholder" />
    </div>
</template>
<script>
export default {
    name: 'InputText',
    props: {
        placeholder: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: '123'
        }
    }
}
</script>
<style lang="scss" scoped>
.input-text-container {
    width: 100%;
    height: 100%;
    position: relative;

    &__input {
        width: 100%;
        height: 100%;
        background-color: $color-bg-6;
        border-radius: $border-radius-small;
        border: none;
        resize: none;
        padding: $gutter;
        color: $color-font-primary;

        @include transitionFast;

        &:focus-visible,
        &:focus {
            outline: none;
        }

        &:focus {
            background-color: $color-bg-5;
            outline: 0.1rem solid $color-bg-7;
        }
    }

    &__label {
        font-size: $font-size-text-secondary;
        font-weight: 700;
        color: $color-font-secondary;
        position: absolute;
        top: calc(0px - calc($font-size-text-secondary * 0.5));
        left: 1rem;
        line-height: 1;
        opacity: 0;

        &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            height: 1rem;
            width: 100%;
            background-color: $color-bg-5;
            z-index: -1;
        }
    }
}
</style>