<template>
  <main @mousemove="isCursorMove = true" class="full-screen-container">
    <div class="full-screen-container__top">
      <div class="full-screen-container__top__title">
        <div class="full-screen-container__top__title__icon-wrapper">
          <IconPrimaryLogo />
        </div>
        <div class="full-screen-container__top__title__text-wrapper">
          <h1 class="full-screen-container__top__title__text-wrapper__from">
            PLAYING FROM {{ fromType }}
          </h1>
          <h2 class="full-screen-container__top__title__text-wrapper__name">{{ fromName }}</h2>
        </div>
      </div>
      <button
        :class="{ 'full-screen-container__top__close-wrapper-show': isCursorMove }"
        class="full-screen-container__top__close-wrapper"
        @click="toggleFullScreenPlayer"
      >
        <div class="full-screen-container__top__close-wrapper__close">
          <IconClose />
        </div>
      </button>
    </div>
    <div class="full-screen-container__content">
      <div
        class="full-screen-container__content__cover-wrapper"
        :class="{ 'full-screen-container__content__cover-wrapper-small': isCursorMove }"
      >
        <img
          class="full-screen-container__content__cover-wrapper__cover"
          :src="coverUrl"
          :alt="track"
        />
      </div>
      <div class="full-screen-container__content__text-wrapper">
        <h1 class="full-screen-container__content__text-wrapper__name">{{ track }}</h1>
        <h2 class="full-screen-container__content__text-wrapper__artist">{{ artist }}</h2>
      </div>
    </div>
    <div
      class="full-screen-container__player"
      :class="{ 'full-screen-container__player-show': isCursorMove }"
    >
      <div class="full-screen-container__player__seek-bar">
        <SeekBar size="large" />
      </div>
      <div class="full-screen-container__player__btns">
        <div class="full-screen-container__player__btns__left"></div>
        <div class="full-screen-container__player__btns__mid">
          <button class="icon-wrapper" :class="{ 'btn-active': isShuffle }" @click="toggleShuffle">
            <IconShuffle />
          </button>
          <button class="icon-wrapper">
            <IconPrevious />
          </button>
          <button class="full-screen-container__player__btns__mid__play" @click="togglePause">
            <span class="full-screen-container__player__btns__mid__play__icon-wrapper-round">
              <IconPlay v-if="isPause" />
              <IconPause v-else />
            </span>
          </button>
          <button class="icon-wrapper">
            <IconNext />
          </button>
          <button
            class="icon-wrapper"
            :class="{ 'btn-active': isRepeat || isRepeatSingle }"
            @click="handleRepeatClick"
          >
            <IconRepeatSingle v-if="isRepeatSingle" />
            <IconRepeat v-else />
          </button>
        </div>
        <div class="full-screen-container__player__btns__right">
          <div class="full-screen-container__player__btns__right__volume">
            <VolumeBar />
          </div>
          <button class="icon-wrapper" @click="toggleFullScreenPlayer">
            <IconFullScreenClose />
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { usePlayerStore } from '@/stores/player'
import { mapWritableState } from 'pinia'
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue'
import IconClose from '@/components/Icons/IconClose.vue'
import IconShuffle from '../Icons/IconShuffle.vue'
import IconPause from '../Icons/IconPause.vue'
import IconPlay from '../Icons/IconPlay.vue'
import IconPrevious from '../Icons/IconPrevious.vue'
import IconNext from '../Icons/IconNext.vue'
import IconRepeat from '../Icons/IconRepeat.vue'
import IconRepeatSingle from '../Icons/IconRepeatSingle.vue'
import IconFullScreenClose from '../Icons/IconFullScreenClose.vue'
import VolumeBar from '@/components/VolumeBar/index.vue'
import SeekBar from '@/components/SeekBar/index.vue'

export default {
  name: 'FullScreenPlayer',
  data() {
    return {
      isCursorMove: true
    }
  },
  computed: {
    ...mapWritableState(usePlayerStore, [
      'fromType',
      'fromName',
      'coverUrl',
      'track',
      'artist',
      'isPause',
      'isRepeat',
      'isRepeatSingle',
      'isShuffle',
      'isMute',
      'volume',
      'showFullScreenPlayer'
    ])
  },
  components: {
    IconPrimaryLogo,
    IconClose,
    IconShuffle,
    IconPause,
    IconPlay,
    IconPrevious,
    IconNext,
    IconRepeat,
    IconRepeatSingle,
    IconFullScreenClose,
    VolumeBar,
    SeekBar
  },
  methods: {
    async toggleFullScreenPlayer() {
      await this.closeFullscreen()
      this.showFullScreenPlayer = !this.showFullScreenPlayer
    },
    togglePause() {
      this.isPause = !this.isPause
    },
    toggleRepeat() {
      this.isRepeat = !this.isRepeat
    },
    toggleShuffle() {
      this.isShuffle = !this.isShuffle
    },
    /* Close fullscreen */
    closeFullscreen() {
      if (document.fullscreenElement != null) {
        document.exitFullscreen()
      }
    },
    handleRepeatClick() {
      if (this.isRepeatSingle) {
        this.isRepeatSingle = false
      } else if (!this.isRepeat) {
        this.isRepeat = true
      } else {
        this.isRepeat = false
        this.isRepeatSingle = true
      }
    }
  },
  watch: {
    isCursorMove: {
      handler(newVal, oldVal) {
        if (newVal) {
          setTimeout(() => {
            this.isCursorMove = false
          }, 3000)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-active:nth-child(n) {
  fill: $color-brand;
  position: relative;

  &::after {
    content: '';
    display: block;
    height: 0.4rem;
    width: 0.4rem;
    border-radius: 50%;
    background-color: $color-brand;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  &:hover {
    fill: $color-brand;
  }
}

.icon-wrapper {
  display: inline-block;
  fill: $color-font-secondary;
  height: 3.2rem;
  width: 3.2rem;
  padding: $gutter;

  @include respond(phone) {
    height: 4.8rem;
    width: 4.8rem;
  }

  &:hover {
    fill: $color-font-primary;
  }

  &:active {
    fill: $color-font-primary;
  }

  @include clickAnimation;
}

.full-screen-container {
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, $color-bg-6, $color-bg-4);
  z-index: 100;
  padding: 4rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  justify-content: space-between;

  @include respond(phone) {
    padding: 4rem 3rem;
  }

  &__top {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;

    &__title {
      display: flex;
      justify-content: start;
      gap: 2rem;

      &__icon-wrapper {
        height: 4rem;
        width: 4rem;
        fill: $color-font-primary;
      }

      &__text-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        line-height: 1;

        &__from {
          letter-spacing: 0.2rem;
          font-size: 1.4rem;
        }

        &__name {
          font-size: 1.6rem;
        }
      }
    }

    &__close-wrapper {
      height: 4rem;
      width: 4rem;
      border-radius: 50%;
      background-color: $color-bg-5;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateX(10rem);
      opacity: 0;

      @include transitionSlow;

      &-show {
        opacity: 1;
        transform: translateX(0rem);
      }

      &__close {
        height: 2rem;
        width: 2rem;
        fill: $color-font-primary;
      }

      @include respond(phone) {
        opacity: 1;
        transform: translateX(0rem);
      }
    }
  }

  &__content {
    flex-shrink: 10;
    display: flex;
    justify-content: start;
    align-items: end;
    gap: 3rem;
    padding: 5rem 0;
    height: 60%;

    @include respond(phone) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    &__cover-wrapper {
      height: 100%;
      aspect-ratio: 1 / 1;
      border-radius: $border-radius-default;
      overflow: hidden;

      @include transitionSlow;

      &-small {
        height: 80%;
      }

      &__cover {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }

      @include respond(phone) {
        width: 90%;
        height: unset;
      }
    }

    &__text-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: end;
      align-items: start;
      line-height: 1;
      gap: 1.6rem;

      &__name {
        font-size: 3rem;
      }

      &__artist {
        font-size: 1.4rem;
        color: $color-font-secondary;
      }
    }
  }

  &__player {
    flex-shrink: 0;
    opacity: 0;

    @include respond(phone) {
      opacity: 1;
    }

    @include transitionSlow;

    &-show {
      opacity: 1;
    }

    &__seek-bar {
      width: 100%;
      margin-bottom: 1.6rem;
    }

    &__btns {
      display: flex;
      justify-content: space-between;

      &__left {
        flex: 3;

        @include respond(phone) {
          display: none;
        }
      }

      &__mid {
        flex: 4;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        @include respond(phone) {
          justify-content: space-between;
        }

        &__play {
          height: 5.2rem;
          width: 5.2rem;
          border-radius: 50%;
          background-color: $color-font-primary;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 $gutter;

          @include clickAnimation;

          @include respond(phone) {
            height: 6.8rem;
            width: 6.8rem;
          }

          &__icon-wrapper-round {
            display: inline-block;
            fill: $color-bg-1;
            height: 1.6rem;
            width: 1.6rem;

            @include respond(phone) {
              height: 3.2rem;
              width: 3.2rem;
            }
          }
        }
      }

      &__right {
        flex: 3;
        display: flex;
        justify-content: end;
        align-items: center;

        @include respond(phone) {
          display: none;
        }
      }
    }
  }
}
</style>
