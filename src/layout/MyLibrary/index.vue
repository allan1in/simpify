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
          <button class="my-library__container__title__right__create-playlist">
            <div class="my-library__container__title__right__create-playlist__icon-wrapper">
              <IconPlus />
            </div>
          </button>
        </div>
      </div>
      <TagBar v-show="!isCollasped" :tags="tags" :isActive @handle-click-tag="changeTag" />
    </div>
  </ResizeBox>
</template>

<script>
import IconLibrary from '@/components/Icons/IconLibrary.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import ResizeBox from './ResizeBox/index.vue'
import TagBar from './TagBar/index.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import IconLibraryCollasped from '@/components/Icons/IconLibraryCollasped.vue'

export default {
  name: 'MyLibrary',
  data() {
    return {
      tags: ['liked_songs', 'playlists', 'albums', 'artists'],
      isActive: 'liked_songs'
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['isCollasped'])
  },
  components: {
    IconLibrary,
    IconPlus,
    ResizeBox,
    TagBar,
    IconLibraryCollasped
  },
  methods: {
    changeTag(tag) {
      this.isActive = tag
    }
  },
  watch: {
    isCollasped: {
      handler(newVal, oldVal) {},
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.my-library__container {
  padding: 1.6rem 1.6rem 0 1.6rem;
  overflow: hidden;

  container-type: inline-size;
  container-name: my-library;

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.8rem;

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
    }
  }
}
</style>
