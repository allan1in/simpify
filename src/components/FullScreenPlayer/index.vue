<template>
  <main @mousemove="isCursorMove = true" class="full-screen-container">
    <div class="full-screen-container__top">
      <div class="full-screen-container__top__title">
        <div class="full-screen-container__top__title__icon-wrapper">
          <IconPrimaryLogo />
        </div>
        <div class="full-screen-container__top__title__text-wrapper" v-if="album.name">
          <h1 class="full-screen-container__top__title__text-wrapper__from">PLAYING FROM ALBUM</h1>
          <h2 class="full-screen-container__top__title__text-wrapper__name">{{ album.name }}</h2>
        </div>
      </div>
      <button
        :class="{
          'full-screen-container__top__close-wrapper-show': isCursorMove || isCursorOverClose
        }"
        class="full-screen-container__top__close-wrapper"
        @click="toggleFullScreenPlayer"
        @mouseover="isCursorOverClose = true"
        @mouseout="isCursorOverClose = false"
      >
        <div class="full-screen-container__top__close-wrapper__close">
          <IconClose />
        </div>
      </button>
    </div>
    <div class="full-screen-container__content">
      <div
        class="full-screen-container__content__cover-wrapper"
        :class="{ 'full-screen-container__content__cover-wrapper-small': !isCursorMove }"
        v-if="album.images"
      >
        <img
          class="full-screen-container__content__cover-wrapper__cover"
          :src="album.images[0].url"
          :alt="track"
        />
      </div>
      <div class="full-screen-container__content__text-wrapper">
        <h1 class="full-screen-container__content__text-wrapper__name" v-if="track">
          {{ track.name }}
        </h1>
        <h2 class="full-screen-container__content__text-wrapper__artist">
          <span v-for="(artist, index) in artists" :key="artist.uri" v-if="artists.length">{{
            (index === 0 ? '' : ', ') + artist.name
          }}</span>
        </h2>
      </div>
    </div>
    <div
      class="full-screen-container__player"
      :class="{ 'full-screen-container__player-show': isCursorMove || isCursorOverPlayer }"
      @mouseover="isCursorOverPlayer = true"
      @mouseout="isCursorOverPlayer = false"
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
          <button class="icon-wrapper" @click="preTrack">
            <IconPrevious />
          </button>
          <button class="full-screen-container__player__btns__mid__play" @click="togglePlay">
            <span class="full-screen-container__player__btns__mid__play__icon-wrapper-round">
              <IconPlay v-if="isPause" />
              <IconPause v-else />
            </span>
          </button>
          <button class="icon-wrapper" @click="nextTrack">
            <IconNext />
          </button>
          <button
            class="icon-wrapper"
            :class="{ 'btn-active': repeatMode !== 0 }"
            @click="setRepeatMode"
          >
            <IconRepeatSingle v-if="repeatMode === 2" />
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
      'album',
      'track',
      'artists',
      'isPause',
      'repeatMode',
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
    toggleFullScreenPlayer() {
      this.closeFullscreen()
      this.showFullScreenPlayer = !this.showFullScreenPlayer
    },
    /* Close fullscreen */
    closeFullscreen() {
      if (document.fullscreenElement != null) {
        document.exitFullscreen()
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

  &:hover {
    fill: $color-font-primary;
  }

  &:active {
    fill: $color-font-primary;
  }

  @include clickAnimation;

  @include respond(phone) {
    height: 4rem;
    width: 4rem;
  }
}

.full-screen-container {
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
  justify-content: space-between;
  gap: 4rem;

  @include respond(phone) {
    gap: 1.6rem;
    padding: 4rem 4rem;
  }

  &__top {
    overflow: hidden;
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
    flex-grow: 1;
    display: flex;
    justify-content: start;
    align-items: end;
    gap: 3rem;

    @include respond(phone) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    @media (orientation: portrait) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    &__cover-wrapper {
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

      @media (orientation: portrait) {
        width: 80%;
        height: unset;

        &-small {
          width: 60%;
          height: unset;
        }
      }

      @include respond(phone) {
        width: 80%;
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
        font-size: 3.2rem;

        @include oneLineEllipsis;

        @include respond(phone) {
          font-size: 2.4rem;
        }
      }

      &__artist {
        font-size: 2.4rem;
        color: $color-font-secondary;

        @include oneLineEllipsis;

        @include respond(phone) {
          font-size: 1.6rem;
        }
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

    @include respond(phone) {
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
          gap: unset;
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
            height: 6rem;
            width: 6rem;
          }

          &__icon-wrapper-round {
            display: inline-block;
            fill: $color-bg-1;
            height: 1.6rem;
            width: 1.6rem;

            @include respond(phone) {
              height: 2.6rem;
              width: 2.6rem;
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
