<template>
    <div class="image-edit-container">
        <div class="image-edit-container__icon-wrapper">
            <IconDefaultPlaylist class="image-edit-container__icon-wrapper__playlist" />
            <IconEdit class="image-edit-container__icon-wrapper__edit" />
        </div>
        <button class="image-edit-container__more">
            <div class="image-edit-container__more__icon-wrapper">
                <IconMore />
            </div>
        </button>
    </div>
</template>
<script>
import IconDefaultPlaylist from '../Icons/IconDefaultPlaylist.vue';
import IconEdit from '../Icons/IconEdit.vue';
import IconMore from '../Icons/IconMore.vue';

export default {
    name: 'ImageEdit',
    components: {
        IconEdit,
        IconDefaultPlaylist,
        IconMore
    }
}
</script>
<style lang="scss" scoped>
.image-edit-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: $color-bg-4;
    border-radius: $border-radius-small;
    box-shadow: 0 0 1.5rem 1rem rgba($color-bg-1, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &:hover &__icon-wrapper {

        &__playlist {
            opacity: 0;
        }

        &__edit {
            opacity: 1;
        }
    }

    &:hover &__more {
        opacity: 1;
    }

    &__icon-wrapper {
        width: 30%;
        aspect-ratio: 1 / 1;
        position: relative;

        &__playlist {
            position: absolute;
            top: 0;
            left: 0;
            aspect-ratio: 1 / 1;
            width: 100%;
            opacity: 1;
            fill: $color-font-secondary;
        }

        &__edit {
            position: absolute;
            top: 0;
            left: 0;
            aspect-ratio: 1 / 1;
            width: 100%;
            opacity: 0;
            fill: $color-font-secondary;
        }
    }

    &__more {
        position: absolute;
        right: $gutter;
        top: $gutter;
        height: 3.2rem;
        aspect-ratio: 1 / 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba($color-bg-2, 0.5);
        border-radius: 50%;
        opacity: 0;

        @include clickAnimation;

        &__icon-wrapper {
            height: 50%;
            width: 50%;
            fill: $color-font-secondary;
        }
    }
}
</style>