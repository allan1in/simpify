<template>
  <DialogGlobal
    v-model="openDialog"
    class="dialog-global-container"
    @before-close="handleBeforeClose"
  >
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
        <AlertBox v-if="showWarnAlert" type="warn" :value="$t('alert_box.require_name')" />
        <AlertBox v-if="showInfoAlert" :value="$t('alert_box.click_create')" />
        <div class="dialog-global-container__form__input__text">
          <InputText
            v-model="name"
            :placeholder="$t('dialog_playlist_create.text_placeholder')"
            :label="$t('dialog_playlist_create.text_label')"
            @validate="validate"
          />
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
import ImageEdit from '@/components/ImageEdit/index.vue'
import InputText from '@/components/InputText/index.vue'
import InputArea from '@/components/InputTextArea/index.vue'
import AlertBox from '@/components/AlertBox/index.vue'
import { createNewPlaylist } from '@/api/meta/playlist'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import Message from '@/components/Message'

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
      showWarnAlert: false,
      showInfoAlert: false
    }
  },
  components: {
    DialogGlobal,
    IconClose,
    ImageEdit,
    InputArea,
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
    ...mapState(useUserStore, ['uid'])
  },
  methods: {
    validate() {
      if (!this.name.length) {
        this.showWarnAlert = true
      }
      return !!this.name.length
    },
    handleBeforeClose() {
      if (this.showInfoAlert) {
        this.openDialog = false
      } else {
        this.showInfoAlert = true
      }
    },
    async submit() {
      if (this.validate()) {
        const data = {
          name: this.name
        }
        const res = await createNewPlaylist(this.uid, data)
        if (!!res?.id) {
          Message(`${this.$t('message.added_to_lib')}`)
        } else {
          Message(`${this.$t('message.something_wrong')}`)
        }
        this.openDialog = false
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal, oldVal) {
        this.name = this.item.name || ''
        this.description = this.item.description || ''
        this.showWarnAlert = false
        this.showInfoAlert = false
      },
      immediate: true
    },
    showInfoAlert(newVal, oldVal) {
      if (newVal) {
        this.showWarnAlert = false
      }
    },
    showWarnAlert(newVal, oldVal) {
      if (newVal) {
        this.showInfoAlert = false
      }
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
