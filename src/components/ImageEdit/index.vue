<template>
    <div class="image-edit-container" @mouseenter="isHover = true" @mouseleave="isHover = false">
        <img v-if="!!currentImages || !!selectedImage.file" class="image-edit-container__img"
            :src="selectedImage.file || currentImages[0]?.url" alt="" />
        <div v-else class="image-edit-container__icon-wrapper">
            <IconDefaultPlaylist class="image-edit-container__icon-wrapper__playlist" />
        </div>
        <div class="image-edit-container__more">
            <DropDown position="right">
                <template #default="{ open }">
                    <div class="image-edit-container__more__wrapper">
                        <button v-show="isHover || open" class="image-edit-container__more__wrapper__btn">
                            <div class="image-edit-container__more__wrapper__btn__icon-wrapper">
                                <IconMore />
                            </div>
                        </button>
                    </div>
                </template>
                <template #dropDownItems>
                    <DropDownItem @click="triggerFileSelect">
                        <template #icon>
                            <div class="image-edit-container__more__drop-down-item__icon-wrapper">
                                <IconPictureEdit />
                            </div>
                        </template>
                        <template #default>
                            {{ $t('drop_down_image_edit.change_picture') }}
                        </template>
                    </DropDownItem>
                    <DropDownItem @click="reset">
                        <template #icon>
                            <div class="image-edit-container__more__drop-down-item__icon-wrapper">
                                <IconPictureDelete />
                            </div>
                        </template>
                        <template #default>
                            {{ $t('drop_down_image_edit.remove_picture') }}
                        </template>
                    </DropDownItem>
                </template>
            </DropDown>
        </div>
    </div>
</template>
<script>
import IconDefaultPlaylist from '../Icons/IconDefaultPlaylist.vue';
import IconEdit from '../Icons/IconEdit.vue';
import IconMore from '../Icons/IconMore.vue';
import DropDown from '@/components/DropDown/index.vue'
import DropDownItem from '@/components/DropDownItem/index.vue'
import IconPictureDelete from '../Icons/IconPictureDelete.vue';
import IconPictureEdit from '../Icons/IconPictureEdit.vue';

export default {
    name: 'ImageEdit',
    props: {
        images: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            isHover: false,
            selectedImage: {
                base64: '',
                file: undefined,
                height: undefined,
                width: undefined,
                size: undefined
            },
            currentImages: undefined
        }
    },
    components: {
        IconEdit,
        IconDefaultPlaylist,
        IconMore,
        DropDown,
        DropDownItem,
        IconPictureDelete,
        IconPictureEdit
    },
    methods: {
        reset() {
            this.selectedImage = {
                base64: '',
                file: undefined,
                height: undefined,
                width: undefined,
                size: undefined
            }
            this.currentImages = undefined
        },
        triggerFileSelect() {
            const input = document.createElement("input")
            input.type = "file"
            input.style.display = "none"
            input.accept = "image/.jpg, image/.jpeg, image/.png"

            input.addEventListener("change", (event) => {
                const file = event.target.files[0]
                if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const img = new Image()
                        img.onload = () => {
                            this.selectedImage.width = img.width
                            this.selectedImage.height = img.height
                        }
                        img.src = e.target.result
                        this.selectedImage.file = e.target.result
                        this.selectedImage.base64 = e.target.result.split(',')[1]
                    }
                    reader.readAsDataURL(file)
                    this.selectedImage.size = Math.ceil(file.size / 1024)
                }
                this.$emit('handleSelectedImage', this.selectedImage)
            });

            input.click()
        }
    },
    created() {
        this.currentImages = this.images
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

    &__img {
        height: 100%;
        width: 100%;
        border-radius: $border-radius-small;
        object-fit: cover;
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
    }

    &__more {
        position: absolute;
        right: $gutter;
        top: $gutter;

        &__wrapper {
            height: 3.2rem;
            aspect-ratio: 1 / 1;

            &__btn {
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba($color-bg-2, 0.5);
                border-radius: 50%;

                @include clickAnimation;

                &__icon-wrapper {
                    height: 50%;
                    width: 50%;
                    fill: $color-font-secondary;
                }
            }
        }

        &__drop-down-item {
            &__icon-wrapper {
                margin-right: $gutter-1-5x;
                height: calc($font-size-text-secondary + 0.2rem);
                width: calc($font-size-text-secondary + 0.2rem);
                fill: $color-font-primary;
            }
        }
    }
}
</style>