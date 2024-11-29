<template>
    <DialogGlobal v-model="openDialog" class="dialog-container">
        <div class="dialog-container__top">
            <h1 class="dialog-container__top__title">{{ $t('dialog_playlist_edit.title') }}</h1>
            <button class="dialog-container__top__close" @click="openDialog = false">
                <div class="dialog-container__top__close__wrapper">
                    <IconClose />
                </div>
            </button>
        </div>
        <div class="dialog-container__form">
            <div class="dialog-container__form__image">
                <ImageEdit v-model="selectedImage" />
            </div>
            <div class="dialog-container__form__input">
                <div class="dialog-container__form__input__text">
                    <InputText maxlength="100" @validate="validate" v-model="name"
                        :placeholder="$t('dialog_playlist_edit.text_placeholder')"
                        :label="$t('dialog_playlist_edit.text_label')" />
                </div>
                <div class="dialog-container__form__input__text-area-wrapper">
                    <InputTextArea maxlength="300" v-model="description"
                        :placeholder="$t('dialog_playlist_edit.textarea_placeholder')"
                        :label="$t('dialog_playlist_edit.textarea_label')" />
                </div>
            </div>
        </div>
        <div class="dialog-container__bottom">
            <div class="dialog-container__bottom__statement">
                {{ $t('dialog_playlist_edit.statement') }}
            </div>
            <button class="dialog-container__bottom__save" @click="submit">
                {{ $t('dialog_playlist_edit.save') }}
            </button>
        </div>
    </DialogGlobal>
</template>
<script>
import { changePlaylistDetails, updatePlaylistCover } from '@/api/meta/playlist'
import DialogGlobal from '@/components/DialogGlobal/index.vue'
import IconClose from '@/components/Icons/IconClose.vue'
import ImageEdit from '@/components/ImageEdit/index.vue'
import InputText from '@/components/InputText/index.vue'
import InputTextArea from '@/components/InputTextArea/index.vue'
import Message from '../Message'

export default {
    name: 'DialogPlaylistEdit',
    props: {
        modelValue: 'modelValue',
        item: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            name: undefined,
            description: undefined,
            minWidth: 300,
            minHeight: 300,
            maxSize: 256,
            selectedImage: undefined
        }
    },
    components: {
        DialogGlobal,
        IconClose,
        ImageEdit,
        InputTextArea,
        InputText
    },
    computed: {
        // https://vuejs.org/guide/components/v-model.html
        openDialog: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        },
        nameChanged() {
            return this.item.name !== this.name
        },
        descriptionChanged() {
            return this.item.description !== this.description
        },
        coverChanged() {
            return Object.keys(this.selectedImage).indexOf('base64') !== -1
        }
    },
    methods: {
        validate() {
            if (!this.name.length) {
                this.showWarnAlert = true
            } else {
                this.showWarnAlert = false
            }
            return !!this.name.length
        },
        async submit() {
            if (this.nameChanged || this.descriptionChanged) {
                const data = {
                    name: this.name,
                    description: this.description
                }
                const res = await changePlaylistDetails(this.item.id, data)
            }
            if (this.coverChanged) {
                const res = await updatePlaylistCover(this.item.id, this.selectedImage.base64)
            }
            this.openDialog = false
            Message(`${this.$t('message.update_succeeded')}`)
            this.$emit('updateSucceed')
        }
    },
    watch: {
        modelValue: {
            handler(newVal, oldVal) {
                this.name = this.item.name
                this.description = this.item.description
                this.selectedImage = this.item.images ? this.item.images[0] : {}
            },
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-container {
    &__top {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__title {
            display: block;
            font-size: $font-size-title-primary;
            font-weight: 700;
        }

        &__close {
            height: 3.2rem;
            aspect-ratio: 1 / 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;

            @include clickAnimation;

            @include transitionFast;

            &:hover {
                background-color: $color-bg-6;
            }

            &__wrapper {
                height: 50%;
                aspect-ratio: 1 / 1;
                fill: $color-font-primary;
            }
        }
    }

    &__form {
        padding: $gutter-2x 0;
        display: flex;
        gap: $gutter-2x;

        &__image {
            flex: 2;
        }

        &__input {
            flex: 3;
            display: flex;
            flex-direction: column;
            gap: $gutter-2x;

            &__text {
                height: calc($font-size-text-primary * 2.5);
            }

            &__text-area-wrapper {
                flex: 1;
            }
        }
    }

    &__bottom {
        display: flex;
        align-items: start;
        gap: $gutter-2x;

        &__statement {
            flex: 1;
            font-size: $font-size-text-secondary;
            font-weight: 700;
        }

        &__save {
            width: max-content;
            height: 5.6rem;
            display: flex;
            align-items: center;
            padding: 0 $gutter-4x;
            font-size: $font-size-text-primary;
            background-color: $color-font-primary;
            color: $color-bg-1;
            border: 1px solid $color-bg-1;
            border-radius: 2.8rem;
            font-weight: 700;

            @include clickAnimation;
        }
    }
}
</style>
