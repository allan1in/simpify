<template>
  <ResizeBox>
    <div class="my-library__container">
      <div class="my-library__container__title">
        <div class="my-library__container__title__left" @click.prevent="isCollasped = !isCollasped">
          <div class="my-library__container__title__left__icon-wrapper">
            <IconLibrary v-show="!isCollasped" />
            <IconLibraryCollasped v-show="isCollasped" />
          </div>
          <span v-show="!isCollasped" class="my-library__container__title__left__text">{{
            $t('my_library.title')
          }}</span>
        </div>
        <div v-show="!isCollasped" class="my-library__container__title__right">
          <button class="my-library__container__title__right__create-playlist" @click="openDialog = true">
            <div class="my-library__container__title__right__create-playlist__icon-wrapper">
              <IconPlus />
            </div>
          </button>
          <button class="my-library__container__title__right__arrow" @click.prevent="isShowMore = !isShowMore">
            <div class="my-library__container__title__right__arrow__wrapper">
              <IconArrowRightLonger v-show="!isShowMore" />
              <IconArrowLeftLonger v-show="isShowMore" />
            </div>
          </button>
        </div>
      </div>
      <div v-show="!isCollasped" class="my-library__container__tag-bar">
        <TagBar :tags="tags" :isActive @handle-click-tag="changeTag" />
      </div>
      <div class="my-library__container__content" :class="{ 'my-library__container__content-collasped': isCollasped }">
        <MyOverlayScrollbars os-element="div" @scroll="updateBottom">
          <div class="my-library__container__content__wrapper">
            <LikedSongs v-if="isActive === 'liked_songs'" />
            <Playlists v-if="isActive === 'playlists'" />
            <Albums v-if="isActive === 'albums'" />
            <Artists v-if="isActive === 'artists'" />
          </div>
        </MyOverlayScrollbars>
      </div>
    </div>
  </ResizeBox>
  <DialogGlobal v-model="openDialog" class="dialog-global-container">
    <div class="dialog-global-container__top">
      <h1 class="dialog-global-container__top__title">{{ $t('dialog_edit_playlist.title') }}</h1>
      <button class="dialog-global-container__top__close">
        <div class="dialog-global-container__top__close__wrapper" @click="openDialog = false">
          <IconClose />
        </div>
      </button>
    </div>
    <div class="dialog-global-container__form">
      <div class="dialog-global-container__form__image">
        <ImageEdit />
      </div>
      <div class="dialog-global-container__form__input">
        <div class="dialog-global-container__form__input__text">
          <InputText :placeholder="$t('dialog_edit_playlist.text_placeholder')" />
        </div>
        <div class="dialog-global-container__form__input__text-area">
          <InputArea :placeholder="$t('dialog_edit_playlist.textarea_placeholder')" />
        </div>
      </div>
    </div>
    <div class="dialog-global-container__bottom">
      <div class="dialog-global-container__bottom__statement">
        {{ $t('dialog_edit_playlist.statement') }}
      </div>
      <button class="dialog-global-container__bottom__save">
        {{ $t('dialog_edit_playlist.save') }}
      </button>
    </div>
  </DialogGlobal>
</template>

<script>
import IconLibrary from '@/components/Icons/IconLibrary.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import ResizeBox from './ResizeBox/index.vue'
import TagBar from './TagBar/index.vue'
import { mapWritableState } from 'pinia'
import IconLibraryCollasped from '@/components/Icons/IconLibraryCollasped.vue'
import IconArrowLeftLonger from '@/components/Icons/IconArrowLeftLonger.vue'
import IconArrowRightLonger from '@/components/Icons/IconArrowRightLonger.vue'
import { useLibraryStore } from '@/stores/library'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import LikedSongs from './LikedSongs/index.vue'
import { computed } from 'vue'
import Playlists from './Playlists/index.vue'
import Albums from './Albums/index.vue'
import Artists from './Artists/index.vue'
import DialogGlobal from '@/components/DialogGlobal/index.vue'
import IconClose from '@/components/Icons/IconClose.vue'
import ImageEdit from '@/components/ImageEdit/index.vue'
import InputText from '@/components/InputText/index.vue'
import InputArea from '@/components/InputTextArea/index.vue'

export default {
  name: 'MyLibrary',
  provide() {
    return {
      bottom: computed(() => this.bottom)
    }
  },
  data() {
    return {
      tags: ['liked_songs', 'playlists', 'albums', 'artists'],
      isActive: 'liked_songs',
      bottom: undefined,
      openDialog: false
    }
  },
  computed: {
    ...mapWritableState(useLibraryStore, ['isCollasped', 'myLibWidth', 'isShowMore'])
  },
  components: {
    IconLibrary,
    IconPlus,
    ResizeBox,
    TagBar,
    IconLibraryCollasped,
    IconArrowLeftLonger,
    IconArrowRightLonger,
    MyOverlayScrollbars,
    LikedSongs,
    Playlists,
    Albums,
    Artists,
    DialogGlobal,
    IconClose,
    ImageEdit,
    InputArea,
    InputText
  },
  methods: {
    changeTag(tag) {
      this.isActive = tag
    },
    updateBottom(bottom) {
      this.bottom = bottom
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

      &__text-area {
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

.my-library__container {
  overflow: hidden;
  container-type: inline-size;
  container-name: container-box;
  overflow: hidden;
  border-radius: $border-radius-default;

  &__title {
    padding: $gutter-2x;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.2rem;
      cursor: pointer;

      &:hover &__icon-wrapper {
        fill: $color-font-primary;
      }

      &:hover &__text {
        color: $color-font-primary;
      }

      &__icon-wrapper {
        margin-left: 0.8rem;
        height: 2.4rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-secondary;

        @include transitionFast;
      }

      &__text {
        font-size: $font-size-text-primary;
        color: $color-font-secondary;
        font-weight: 700;

        @include transitionFast;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      &__create-playlist {
        border-radius: 50%;
        padding: 0.5rem;

        @include clickAnimation;

        @include transitionFast;

        &:hover {
          background-color: $color-bg-3;
        }

        &:hover &__icon-wrapper {
          fill: $color-font-primary;
        }

        &__icon-wrapper {
          height: 1.4rem;
          aspect-ratio: 1 / 1;
          fill: $color-font-secondary;

          @include transitionFast;
        }
      }

      &__arrow {
        border-radius: 50%;
        padding: 0.5rem;

        @include clickAnimation;

        @include transitionFast;

        &:hover {
          background-color: $color-bg-3;
        }

        &:hover &__icon-wrapper {
          fill: $color-font-primary;
        }

        &__wrapper {
          height: 1.4rem;
          aspect-ratio: 1 / 1;
          fill: $color-font-secondary;

          @include transitionFast;
        }
      }
    }
  }

  &__tag-bar {
    padding: 0 $gutter-2x $gutter-2x $gutter-2x;
  }

  &__content {
    height: calc($height-content - 10.4rem);

    &-collasped:nth-child(n) {
      height: calc($height-content - 5.6rem);
    }

    &__wrapper {
      padding: 0 $gutter $gutter $gutter;
    }
  }
}
</style>
