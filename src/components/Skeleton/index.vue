<template>
    <div class="skeleton-container" :class="shapeClass">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'Skeleton',
    props: {
        shape: {
            type: String,
            require: false,
            default: 'square'
        }
    },
    computed: {
        shapeClass() {
            return {
                square: this.shape === 'square',
                circle: this.shape === 'circle'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.skeleton-container {
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, $color-bg-5 25%, $color-bg-6 50%, $color-bg-5 75%);
    background-size: 400%;
    background-position: 100% 0;
    animation: loading 1.6s ease infinite;
}

.square {
    border-radius: $border-radius-small;
}

.circle {
    border-radius: 50%;
}

@keyframes loading {
    from {
        background-position: 100% 0;
    }

    to {
        background-position: 0 0;
    }
}
</style>