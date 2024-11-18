<template>
  <div ref="resizeBox" class="my-library">
    <div class="my-library__resize-handle" @mousedown="handleMouseDown">
      <div class="my-library__resize-handle__line"></div>
    </div>
    <div class="my-library__container">
      <div class="my-library__container__title">
        <div class="my-library__container__title__left">
          <div class="my-library__container__title__left__icon-wrapper">
            <IconLibrary />
          </div>
          <span class="my-library__container__title__left__text">音乐库</span>
        </div>
        <div class="my-library__container__title__right">
          <button class="my-library__container__title__right__create-playlist">
            <div class="my-library__container__title__right__create-playlist__icon-wrapper">
              <IconPlus />
            </div>
          </button>
        </div>
      </div>
      <div class="my-library__container__top-bar">
        <template v-for="tag in tags" :key="tag">
          <TagButton
            @handle-click="changeTag(tag)"
            :text="$t(`top_bar.${tag}`)"
            :isActive="isActive === tag"
          />
        </template>
      </div>
      <div class="my-library__container__search"></div>
    </div>
  </div>
</template>

<script>
import IconLibrary from '@/components/Icons/IconLibrary.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import TagButton from '@/components/TagButton/index.vue'

export default {
  name: 'MyLibrary',
  data() {
    return {
      maxWidth: 360,
      minWidth: 72,
      tags: ['all', 'playlists', 'albums', 'artists'],
      isActive: 'all'
    }
  },
  components: {
    IconLibrary,
    IconPlus,
    TagButton
  },
  methods: {
    handleMouseDown(event) {
      event.preventDefault()

      let boxLeft = this.$refs.resizeBox.getBoundingClientRect().left
      let newWidth

      document.onmousemove = (e) => {
        if (e.clientX > boxLeft + this.maxWidth) {
          newWidth = this.maxWidth + 'px'
        } else if (e.clientX < boxLeft + this.minWidth) {
          newWidth = this.minWidth + 'px'
        } else {
          newWidth = e.clientX - boxLeft + 'px'
        }

        // Update new Width
        this.$refs.resizeBox.style.width = newWidth
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    changeTag(tag) {
      this.isActive = tag
    }
  }
}
</script>

<style lang="scss" scoped>
.my-library {
  background-color: $color-bg-2;
  border-radius: $border-radius-default;
  position: relative;
  width: 360px;

  &__resize-handle {
    width: $gutter;
    height: 98%;
    position: absolute;
    top: 50%;
    right: calc(0px - $gutter);
    transform: translateY(-50%);
    cursor: grab;
    display: flex;
    justify-content: center;

    &:hover &__line {
      background-color: $color-font-secondary;
    }

    &:active &__line {
      background-color: $color-font-primary;
      cursor: grabbing;
    }

    &:active {
      cursor: grabbing;
    }

    &__line {
      width: 0.1rem;
      height: 100%;
      cursor: grab;

      @include transitionFast;

      &:active {
        cursor: grabbing;
      }
    }
  }

  &__container {
    padding: 1.6rem 1.6rem 0 1.6rem;

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
          padding: 0.8rem;

          @include clickAnimation;

          @include transitionFast;

          &:hover {
            background-color: $color-bg-3;
          }

          &:hover &__icon-wrapper {
            fill: $color-font-primary;
          }

          &__icon-wrapper {
            height: $font-size-text-primary;
            aspect-ratio: 1 / 1;
            fill: $color-font-secondary;

            @include transitionFast;
          }
        }
      }
    }

    &__top-bar {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 1.2rem;
      padding: 1.2rem 0;
    }
  }
}
</style>
