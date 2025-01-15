<template>
  <ResizeBox>
    <div class="my-library__container">
      <div class="my-library__container__title">
        <div
          v-tooltip="toolTipTitle"
          class="my-library__container__title__left"
          @click.prevent="active_collasped = !active_collasped"
        >
          <div class="my-library__container__title__left__icon-wrapper">
            <IconLibrary v-if="!active_collasped" />
            <IconLibraryCollasped v-else />
          </div>
          <span v-if="!active_collasped" class="my-library__container__title__left__text">{{
            $t('my_library.title')
          }}</span>
        </div>
        <Transition :name="resizing ? '' : 'fade'">
          <div v-if="!active_collasped" class="my-library__container__title__right">
            <button
              v-tooltip="$t('tooltip.create_playlist')"
              class="my-library__container__title__right__create-playlist"
              @click.prevent="openDialog = true"
            >
              <div class="my-library__container__title__right__create-playlist__icon-wrapper">
                <IconPlus />
              </div>
            </button>
            <button
              v-tooltip="toolTipArrow"
              class="my-library__container__title__right__arrow"
              @click.prevent="active_show_more = !active_show_more"
            >
              <div class="my-library__container__title__right__arrow__wrapper">
                <Transition :name="resizing ? '' : 'fade'" mode="out-in">
                  <IconArrowRightLonger v-if="!active_show_more" />
                  <IconArrowLeftLonger v-else />
                </Transition>
              </div>
            </button>
          </div>
        </Transition>
      </div>
      <TransitionGroup name="list-fade">
        <div v-if="!active_collasped" class="my-library__container__tag-bar" :key="'tagbar'">
          <TagBar />
        </div>
        <div
          class="my-library__container__content"
          :class="{ 'my-library__container__content-collasped': active_collasped }"
          :key="'content'"
        >
          <MyOverlayScrollbars ref="scrollbar" os-element="div" @scroll="updateBottom">
            <div class="my-library__container__content__wrapper">
              <Songs :active="current_tag === 'songs'" />
              <Playlists :active="current_tag === 'playlists'" />
              <Albums :active="current_tag === 'albums'" />
              <Artists :active="current_tag === 'artists'" />
            </div>
          </MyOverlayScrollbars>
        </div>
      </TransitionGroup>
    </div>
  </ResizeBox>
  <DialogPlaylistCreate v-model="openDialog" />
</template>

<script>
import IconLibrary from '@/components/Icons/IconLibrary.vue'
import ResizeBox from './ResizeBox/index.vue'
import TagBar from './TagBar/index.vue'
import { mapWritableState } from 'pinia'
import IconLibraryCollasped from '@/components/Icons/IconLibraryCollasped.vue'
import IconArrowLeftLonger from '@/components/Icons/IconArrowLeftLonger.vue'
import IconArrowRightLonger from '@/components/Icons/IconArrowRightLonger.vue'
import { useLibraryStore } from '@/stores/library'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Songs from './Songs/index.vue'
import { computed } from 'vue'
import Playlists from './Playlists/index.vue'
import Albums from './Albums/index.vue'
import Artists from './Artists/index.vue'
import DialogPlaylistCreate from '@/components/DialogPlaylistCreate/index.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'

export default {
  name: 'MyLibrary',
  provide() {
    return {
      bottom: computed(() => this.bottom)
    }
  },
  data() {
    return {
      bottom: undefined,
      openDialog: false
    }
  },
  computed: {
    ...mapWritableState(useLibraryStore, ['active_collasped', 'active_show_more', 'current_tag']),
    toolTipTitle() {
      if (this.active_collasped) {
        return { content: this.$t('tooltip.expand_lib'), placement: 'right' }
      }
      return { content: this.$t('tooltip.collaspe_lib'), placement: 'top' }
    },
    toolTipArrow() {
      if (this.active_show_more) {
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
    Songs,
    Playlists,
    Albums,
    Artists,
    DialogPlaylistCreate,
    IconPlus
  },
  methods: {
    updateBottom(bottom) {
      this.bottom = bottom
    },
    scrollToTop() {
      const instance = this.$refs.scrollbar.getOsInstance()
      if (instance) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
        instance.elements().viewport.scrollTo({ top: 0 })
      }
    }
  },
  watch: {
    current_tag() {
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
    }
  }

  &__content__wrapper {
    overflow: hidden;
    min-height: 100%;
  }
}
</style>
