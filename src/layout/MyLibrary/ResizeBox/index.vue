<template>
    <div ref="resizeBox" class="my-library">
        <div class="my-library__resize-handle" @mousedown="handleMouseDown">
            <div class="my-library__resize-handle__line"></div>
        </div>
        <slot></slot>
    </div>
</template>
<script>
import { useAppStore } from '@/stores/app';
import { mapWritableState } from 'pinia';

export default {
    name: "ResizeBox",
    data() {
        return {
            maxWidth: 1360,
            minWidth: 72
        }
    },
    computed: {
        ...mapWritableState(useAppStore, ['myLibWidth'])
    },
    methods: {
        handleMouseDown(event) {
            event.preventDefault()

            let boxLeft = this.$refs.resizeBox.getBoundingClientRect().left
            let preWidth
            let newWidth

            document.onmousemove = (e) => {
                preWidth = this.$refs.resizeBox.offsetWidth

                if (e.clientX > boxLeft + this.maxWidth) {
                    newWidth = this.maxWidth
                } else if (e.clientX < boxLeft + this.minWidth) {
                    newWidth = this.minWidth
                } else {
                    newWidth = e.clientX - boxLeft
                }

                // Update new Width
                this.$refs.resizeBox.style.width = newWidth + 'px'
                this.myLibWidth = newWidth
            }

            document.onmouseup = () => {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.my-library {
    background-color: $color-bg-2;
    border-radius: $border-radius-default;
    position: relative;
    width: 1360px;

    &__resize-handle {
        width: $gutter;
        height: 98%;
        position: absolute;
        top: 50%;
        right: calc(0px - $gutter);
        transform: translateY(-50%);
        cursor: grab;
        display: flex;
        justify-content: center;

        &:hover &__line {
            background-color: $color-font-secondary;
        }

        &:active &__line {
            background-color: $color-font-primary;
            cursor: grabbing;
        }

        &:active {
            cursor: grabbing;
        }

        &__line {
            width: 0.1rem;
            height: 100%;
            cursor: grab;

            @include transitionFast;

            &:active {
                cursor: grabbing;
            }
        }
    }
}
</style>