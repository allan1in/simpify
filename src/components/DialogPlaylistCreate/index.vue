<template>
    <DialogGlobal :loading v-model="openDialog" class="dialog-global-container" @click-outside="handleBeforeClose">
        <div class="dialog-global-container__top">
            <h1 class="dialog-global-container__top__title">{{ $t('dialog_playlist_create.title') }}</h1>
            <button class="dialog-global-container__top__close" @click="openDialog = false">
                <div class="dialog-global-container__top__close__wrapper">
                    <IconClose />
                </div>
            </button>
        </div>
        <div class="dialog-global-container__form">
            <div class="dialog-global-container__form__input">
                <AlertBox v-if="alertVariables.showWarnAlert" type="warn" :value="$t('alert_box.require_name')" />
                <AlertBox v-if="alertVariables.showInfoAlert" :value="$t('alert_box.click_create')" />
                <div class="dialog-global-container__form__input__text">
                    <InputText v-model="name" :maxlength="100"
                        :placeholder="$t('dialog_playlist_create.text_placeholder')"
                        :label="$t('dialog_playlist_create.text_label')" @validate="validate" />
                </div>
            </div>
        </div>
        <div class="dialog-global-container__bottom">
            <button class="dialog-global-container__bottom__save" @click="submit">
                {{ $t('dialog_playlist_create.create') }}
            </button>
        </div>
    </DialogGlobal>
</template>
<script>
import DialogGlobal from '@/components/DialogGlobal/index.vue'
import IconClose from '@/components/Icons/IconClose.vue'
import InputText from '@/components/InputText/index.vue'
import AlertBox from '@/components/AlertBox/index.vue'
import { createNewPlaylist } from '@/api/meta/playlist'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import Message from '@/components/Message'
import { useLibraryStore } from '@/stores/library'

export default {
    name: 'DialogPlaylistEdit',
    props: {
        modelValue: {}
    },
    data() {
        return {
            name: '',
            alertVariables: {
                showWarnAlert: false,
                showInfoAlert: false
            },
            loading: false
        }
    },
    components: {
        DialogGlobal,
        IconClose,
        InputText,
        AlertBox
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
        ...mapState(useUserStore, ['uid', 'display_name'])
    },
    methods: {
        updateAlertToTrue(key) {
            Object.keys(this.alertVariables).forEach((key) => {
                this.alertVariables[key] = false
            })
            this.alertVariables[key] = true
        },
        validate() {
            if (!this.name.length) {
                this.updateAlertToTrue('showWarnAlert')
            } else {
                this.alertVariables.showWarnAlert = false
            }
            return !!this.name.length
        },
        handleBeforeClose() {
            if (this.name !== '') {
                if (this.alertVariables.showInfoAlert) {
                    this.openDialog = false
                } else {
                    this.updateAlertToTrue('showInfoAlert')
                }
            } else {
                this.openDialog = false
            }
        },
        async submit() {
            if (this.validate()) {
                this.loading = true
                const data = {
                    name: this.name
                }
                const res = await createNewPlaylist(this.uid, data)
                if (res?.id) {
                    res.owner.display_name = this.display_name
                    useLibraryStore().addPlaylists(res)
                    Message(`${this.$t('message.added_to_lib')}`)
                } else {
                    Message(`${this.$t('message.something_wrong')}`)
                }
                this.loading = false
                this.openDialog = false
            }
        }
    },
    watch: {
        modelValue: {
            handler() {
                this.name = ''
                this.alertVariables.showWarnAlert = false
                this.alertVariables.showInfoAlert = false
            },
            immediate: true
        }
    }
}
</script>
<style lang="scss" scoped>
.dialog-global-container {
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

        &__input {
            display: flex;
            flex-direction: column;
            gap: $gutter-2x;

            &__text {
                height: calc($font-size-text-primary * 2.5);
            }
        }
    }

    &__bottom {
        display: flex;
        align-items: start;
        gap: $gutter-2x;

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
