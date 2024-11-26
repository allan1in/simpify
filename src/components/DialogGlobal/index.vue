<template>
    <Teleport to="body">
        <Transition name="fade">
            <div ref="dialogContainer" class="dialog-global-container" v-if="modelValue" @click="handleClickContainer">
                <div class="dialog-global-container__box" v-bind="$attrs">
                    <slot></slot>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
<script>
export default {
    name: 'DialogGlobal',
    props: [
        'modelValue'
    ],
    inheritAttrs: false,
    methods: {
        handleClickContainer(event) {
            if (event.target === this.$refs.dialogContainer) {
                this.$emit('update:modelValue', false)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-global-container {
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba($color-bg-1, 0.5);

    &__box {
        position: fixed;
        z-index: 999999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60rem;
        height: unset;
        margin: 0 auto;
        background-color: $color-bg-4;
        border-radius: $border-radius-default;
        overflow: hidden;
        padding: $gutter-3x;
    }
}
</style>