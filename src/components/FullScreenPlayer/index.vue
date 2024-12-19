<template>
  <Transition name="slide-from-bottom">
    <main
      v-show="showFullScreenPlayer"
      @mousemove="isCursorMove = true"
      class="full-screen-container"
    >
      <div
        class="full-screen-container__background"
        :class="{ 'full-screen-container__background-pause': isPause }"
      ></div>
      <div class="full-screen-container__wrapper">
        <div class="full-screen-container__wrapper__top">
          <div class="full-screen-container__wrapper__top__title">
            <div class="full-screen-container__wrapper__top__title__icon-wrapper">
              <IconPrimaryLogo />
            </div>
            <div
              class="full-screen-container__wrapper__top__title__text-wrapper"
              v-if="current_track?.album?.name"
            >
              <h1 class="full-screen-container__wrapper__top__title__text-wrapper__from">
                {{ $t('fullscreen_player.title') }}
              </h1>
              <h2 class="full-screen-container__wrapper__top__title__text-wrapper__name">
                {{ current_track.album.name }}
              </h2>
            </div>
          </div>
          <button
            v-tooltip="$t('tooltip.exit_fullscreen')"
            :class="{
              'full-screen-container__wrapper__top__close-wrapper-show':
                isCursorMove || isCursorOverClose
            }"
            class="full-screen-container__wrapper__top__close-wrapper"
            @click="closeFullScreenPlayer"
            @mouseover="isCursorOverClose = true"
            @mouseout="isCursorOverClose = false"
          >
            <div class="full-screen-container__wrapper__top__close-wrapper__close">
              <IconClose />
            </div>
          </button>
        </div>
        <div class="full-screen-container__wrapper__content">
          <div
            class="full-screen-container__wrapper__content__cover-wrapper"
            :class="{
              'full-screen-container__wrapper__content__cover-wrapper-small': !isCursorMove
            }"
            v-if="current_track?.album?.images"
          >
            <Image
              class="full-screen-container__wrapper__content__cover-wrapper__cover"
              :src="current_track.album.images[0].url"
              :alt="current_track.name"
            />
          </div>
          <div class="full-screen-container__wrapper__content__text-wrapper">
            <h1
              class="full-screen-container__wrapper__content__text-wrapper__name"
              v-if="current_track"
            >
              {{ current_track.name }}
            </h1>
            <h2 class="full-screen-container__wrapper__content__text-wrapper__artist">
              <span v-for="(artist, index) in current_track?.artists" :key="artist.uri">{{
                (index === 0 ? '' : ', ') + artist.name
              }}</span>
            </h2>
          </div>
        </div>
        <div
          class="full-screen-container__wrapper__player"
          :class="{
            'full-screen-container__wrapper__player-show': isCursorMove || isCursorOverPlayer
          }"
          @mouseover="isCursorOverPlayer = true"
          @mouseout="isCursorOverPlayer = false"
        >
          <div class="full-screen-container__wrapper__player__seek-bar">
            <SeekBar size="large" />
          </div>
          <div class="full-screen-container__wrapper__player__btns">
            <div class="full-screen-container__wrapper__player__btns__left"></div>
            <div class="full-screen-container__wrapper__player__btns__mid">
              <button
                v-tooltip="toolTipShuffle"
                class="icon-wrapper"
                :class="{ 'btn-active': isShuffle }"
                @click="toggleShuffle"
              >
                <IconShuffle />
              </button>
              <button v-tooltip="$t('tooltip.previous')" class="icon-wrapper" @click="preTrack">
                <IconPrevious />
              </button>
              <button
                v-tooltip="toolTipPlay"
                class="full-screen-container__wrapper__player__btns__mid__play"
                @click="togglePlay"
              >
                <span
                  class="full-screen-container__wrapper__player__btns__mid__play__icon-wrapper-round"
                >
                  <IconPlay v-if="isPause" />
                  <IconPause v-else />
                </span>
              </button>
              <button v-tooltip="$t('tooltip.next')" class="icon-wrapper" @click="nextTrack">
                <IconNext />
              </button>
              <button
                v-tooltip="toolTipRepeat"
                class="icon-wrapper"
                :class="{ 'btn-active': repeatMode !== 0 }"
                @click="setRepeatMode"
              >
                <IconRepeatSingle v-if="repeatMode === 2" />
                <IconRepeat v-else />
              </button>
            </div>
            <div class="full-screen-container__wrapper__player__btns__right">
              <div class="full-screen-container__wrapper__player__btns__right__volume">
                <VolumeBar />
              </div>
              <button
                v-tooltip="$t('tooltip.exit_fullscreen')"
                class="icon-wrapper"
                @click="closeFullScreenPlayer"
              >
                <IconFullScreenClose />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </Transition>
</template>

<script>
import { usePlayerStore } from '@/stores/player'
import { mapActions, mapWritableState } from 'pinia'
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
import { useAppStore } from '@/stores/app'
import Image from '@/components/Image/index.vue'

export default {
  name: 'FullScreenPlayer',
  data() {
    return {
      isCursorMove: true,
      isCursorOverPlayer: false,
      isCursorOverClose: false
    }
  },
  computed: {
    ...mapWritableState(usePlayerStore, [
      'current_track',
      'isPause',
      'repeatMode',
      'isShuffle',
      'isMute',
      'volume'
    ]),
    ...mapWritableState(useAppStore, ['showFullScreenPlayer']),
    toolTipShuffle() {
      if (this.isShuffle) {
        return this.$t('tooltip.disable_shuffle')
      }
      return this.$t('tooltip.enable_shuffle')
    },
    toolTipPlay() {
      if (this.isPause) {
        return this.$t('tooltip.play')
      }
      return this.$t('tooltip.pause')
    },
    toolTipRepeat() {
      if (this.repeatMode === 0) {
        return this.$t('tooltip.repeat_enable')
      } else if (this.repeatMode === 1) {
        return this.$t('tooltip.repeat_one')
      } else if (this.repeatMode === 2) {
        return this.$t('tooltip.repeat_disable')
      } else {
        throw Error('Invalid value of repeatMode! Only accept values 0, 1 or 2.')
      }
    }
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
    SeekBar,
    Image
  },
  methods: {
    async closeFullScreenPlayer() {
      await this.closeFullscreen()
      this.showFullScreenPlayer = false
    },
    /* Close fullscreen */
    async closeFullscreen() {
      if (document.fullscreenElement != null) {
        await document.exitFullscreen()
      }
    },
    ...mapActions(usePlayerStore, [
      'togglePlay',
      'nextTrack',
      'preTrack',
      'setRepeatMode',
      'toggleShuffle'
    ])
  },
  watch: {
    isCursorMove: {
      handler(newVal) {
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

  &:hover {
    fill: $color-font-primary;
  }

  &:active {
    fill: $color-font-primary;
  }

  @include clickAnimation;
}

.full-screen-container {
  height: inherit;
  width: inherit;
  min-height: inherit;
  min-width: inherit;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  overflow: hidden;

  &__background {
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-3);
    height: 400%;
    width: 400%;
    position: absolute;
    top: 0;
    left: 0;
    animation: pulse 3.2s infinite;
    animation-play-state: running;

    &-pause {
      animation-play-state: paused;
    }

    @keyframes pulse {
      0% {
        transform: scale(1) rotate(0);
      }

      50% {
        transform: scale(4) rotate(180deg);
      }

      100% {
        transform: scale(1) rotate(0);
      }
    }
  }

  &__wrapper {
    height: inherit;
    width: inherit;
    min-height: inherit;
    min-width: inherit;
    padding: 4rem 6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 4rem;
    overflow: hidden;
    position: absolute;
    z-index: 1000;

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
            font-size: 1.4rem;
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
        transition-property: transform, opacity;
        transition-duration: $duration-slow;
        transition-timing-function: ease;

        &:hover {
          opacity: 0.8;
        }

        &-show {
          opacity: 1;
          transform: translateX(0rem);
        }

        &__close {
          height: 2rem;
          width: 2rem;
          fill: $color-font-primary;
        }
      }
    }

    &__content {
      height: 0;
      min-height: 20rem;
      flex-grow: 1;
      display: flex;
      justify-content: start;
      align-items: end;
      gap: 3rem;

      &__cover-wrapper {
        flex-shrink: 0;
        height: 60%;
        aspect-ratio: 1 / 1;
        border-radius: $border-radius-default;
        overflow: hidden;

        @include transitionSlow;

        &-small {
          height: 40%;
        }

        &__cover {
          height: 100%;
          width: 100%;
          object-fit: cover;
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
          font-size: 3.2rem;

          @include oneLineEllipsis;
        }

        &__artist {
          font-size: 2.4rem;
          color: $color-font-secondary;

          @include oneLineEllipsis;
        }
      }
    }

    &__player {
      flex-shrink: 0;
      opacity: 0;

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
        }

        &__mid {
          flex: 4;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: $gutter-1-5x;

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

            &__icon-wrapper-round {
              display: inline-block;
              fill: $color-bg-1;
              height: 1.6rem;
              width: 1.6rem;
            }
          }
        }

        &__right {
          flex: 3;
          display: flex;
          justify-content: end;
          align-items: center;
        }
      }
    }
  }
}
</style>
