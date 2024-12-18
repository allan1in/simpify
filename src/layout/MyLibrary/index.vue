<template>
  <ResizeBox>
    <div class="my-library__container">
      <div class="my-library__container__title">
        <div v-tooltip="toolTipTitle" class="my-library__container__title__left"
          @click.prevent="isCollasped = !isCollasped">
          <div class="my-library__container__title__left__icon-wrapper">
            <IconLibrary v-if="!isCollasped" />
            <IconLibraryCollasped v-else />
          </div>

          <span v-if="!isCollasped" class="my-library__container__title__left__text">{{
            $t('my_library.title')
          }}</span>
        </div>
        <Transition name="fade">
          <div v-tooltip="toolTipArrow" v-if="!isCollasped" class="my-library__container__title__right">
            <button class="my-library__container__title__right__arrow" @click.prevent="isShowMore = !isShowMore">
              <div class="my-library__container__title__right__arrow__wrapper">
                <Transition name="fade" mode="out-in">
                  <IconArrowRightLonger v-if="!isShowMore" />
                  <IconArrowLeftLonger v-else />
                </Transition>
              </div>
            </button>
          </div>
        </Transition>
      </div>
      <TransitionGroup name="list-fade">
        <div v-if="!isCollasped" class="my-library__container__tag-bar" :key="'tagbar'">
          <TagBar :tags="tags" :activeTag @handle-click-tag="changeActiveTag" />
        </div>
        <div class="my-library__container__content" :class="{ 'my-library__container__content-collasped': isCollasped }"
          :key="'content'">
          <MyOverlayScrollbars ref="scrollbar" os-element="div" @scroll="updateBottom">
            <div class="my-library__container__content__wrapper">
              <LikedSongs :active="activeTag === 'liked_songs'" />
              <Playlists :active="activeTag === 'playlists'" />
              <Albums :active="activeTag === 'albums'" />
              <Artists :active="activeTag === 'artists'" />
            </div>
          </MyOverlayScrollbars>
        </div>
      </TransitionGroup>
    </div>
  </ResizeBox>
</template>

<script>
import IconLibrary from '@/components/Icons/IconLibrary.vue'
import ResizeBox from './ResizeBox/index.vue'
import TagBar from './TagBar/index.vue'
import { mapActions, mapWritableState } from 'pinia'
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
      bottom: undefined
    }
  },
  computed: {
    ...mapWritableState(useLibraryStore, [
      'duringTransitionWidth',
      'isCollasped',
      'myLibWidth',
      'isShowMore',
      'activeTag'
    ]),
    toolTipTitle() {
      if (this.isCollasped) {
        return { content: this.$t('tooltip.expand_lib'), placement: 'right' }
      }
      return { content: this.$t('tooltip.collaspe_lib'), placement: 'top' }
    },
    toolTipArrow() {
      if (this.isShowMore) {
        return this.$t('tooltip.show_less')
      }
      return this.$t('tooltip.show_more')
    }
  },
  components: {
    IconLibrary,
    ResizeBox,
    TagBar,
    IconLibraryCollasped,
    IconArrowLeftLonger,
    IconArrowRightLonger,
    MyOverlayScrollbars,
    LikedSongs,
    Playlists,
    Albums,
    Artists
  },
  methods: {
    ...mapActions(useLibraryStore, ['changeActiveTag']),
    updateBottom(bottom) {
      this.bottom = bottom
    },
    scrollToTop() {
      const instance = this.$refs.scrollbar.getOsInstance()
      if (instance) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
        instance.elements().viewport.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  },
  watch: {
    activeTag() {
      this.scrollToTop()
    }
  }
}
</script>

<style lang="scss" scoped>
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
    gap: $gutter;

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

        @include oneLineEllipsis;
      }
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 0.8rem;

      &__arrow {
        border-radius: 50%;
        padding: 0.5rem;

        @include transitionFast;

        &:hover {
          background-color: $color-bg-3;
        }

        &:active {
          opacity: 0.8;
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
      width: 100%;
      overflow: hidden;
    }
  }
}
</style>
