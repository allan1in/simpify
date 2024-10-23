<template>
  <footer class="player-bar">
    <div class="player-bar__left">
      <div class="player-bar__left__cover-wrapper">
        <img class="player-bar__left__cover-wrapper__cover" :src="coverUrl" alt="" />
      </div>
      <div class="player-bar__left__msg-wrapper">
        <div class="player-bar__left__msg-wrapper__title">{{ name }}</div>
        <div class="player-bar__left__msg-wrapper__artist">{{ artist }}</div>
      </div>
      <!-- <button class="icon-wrapper" @click="song.isLike = !song.isLike">
        <IconInLikeSong v-if="song.isLike" />
        <IconAddToLikeSong v-else />
      </button> -->
    </div>
    <div class="player-bar__mid">
      <div class="player-bar__mid__btn-group">
        <button class="icon-wrapper" :class="{ 'btn-active': isShuffle }" @click="isShuffle = !isShuffle">
          <IconShuffle />
        </button>
        <button class="icon-wrapper">
          <IconPrevious />
        </button>
        <button class="player-bar__mid__btn-group__play" @click="isPause = !isPause">
          <span class="player-bar__mid__btn-group__play__icon-wrapper-round">
            <IconPlay v-if="isPause" />
            <IconPause v-else />
          </span>
        </button>
        <button class="icon-wrapper">
          <IconNext />
        </button>
        <button class="icon-wrapper" :class="{ 'btn-active': isRepeat }" @click="isRepeat = !isRepeat">
          <IconRepeat />
        </button>
      </div>
      <div class="player-bar__mid__bottom">
        <div class="player-bar__mid__bottom__seek">-:--</div>
        <ProcessBar :percentage="percentage" />
        <div class="player-bar__mid__bottom__duration">-:--</div>
      </div>
    </div>
    <div class="player-bar__right">
      <!-- <button
        class="icon-wrapper"
        :class="{ 'btn-active': isNowPlayingView }"
        @click="isNowPlayingView = !isNowPlayingView"
      >
        <IconNowPlayingView />
      </button> -->
      <!-- <button
        class="icon-wrapper"
        :class="{ 'btn-active': isLyrics }"
        @click="isLyrics = !isLyrics"
      >
        <IconLyrics />
      </button> -->
      <!-- <button class="icon-wrapper" :class="{ 'btn-active': isQueen }" @click="isQueen = !isQueen">
        <IconQueen />
      </button>
      <button
        class="icon-wrapper"
        :class="{ 'btn-active': isConnectToDevice }"
        @click="isConnectToDevice = !isConnectToDevice"
      >
        <IconConnectToDevice />
      </button> -->
      <VolumeBar :isMute="isMute" :volume="volume" @mute="isMute = !isMute" />
      <button class="icon-wrapper" :class="{ 'btn-active': isMiniPlayer }" @click="isMiniPlayer = !isMiniPlayer">
        <IconMiniPlayer />
      </button>
      <button class="icon-wrapper" @click="toggleFullScreemPlayer">
        <IconFullScreen />
      </button>
    </div>
  </footer>
</template>

<script>
import IconAddToLikeSong from '@/components/Icons/IconAddToLikeSong.vue'
import IconNext from '@/components/Icons/IconNext.vue'
import IconPause from '@/components/Icons/IconPause.vue'
import IconPlay from '@/components/Icons/IconPlay.vue'
import IconPrevious from '@/components/Icons/IconPrevious.vue'
import IconRepeat from '@/components/Icons/IconRepeat.vue'
import IconShuffle from '@/components/Icons/IconShuffle.vue'
import ProcessBar from '@/components/ProcessBar/index.vue'
import IconNowPlayingView from '@/components/Icons/IconNowPlayingView.vue'
import IconQueen from '@/components/Icons/IconQueen.vue'
import IconConnectToDevice from '@/components/Icons/IconConnectToDevice.vue'
import IconLyrics from '@/components/Icons/IconLyrics.vue'
import IconMiniPlayer from '@/components/Icons/IconMiniPlayer.vue'
import IconFullScreen from '@/components/Icons/IconFullScreen.vue'
import IconInLikeSong from '@/components/Icons/IconInLikeSong.vue'
import { mapActions, mapState } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useTrackStore } from '@/stores/track'
import VolumeBar from '@/components/VolumeBar/index.vue'

export default {
  name: 'Player',
  components: {
    IconPlay,
    IconPause,
    IconNext,
    IconPrevious,
    IconShuffle,
    IconRepeat,
    IconAddToLikeSong,
    IconNowPlayingView,
    IconQueen,
    IconConnectToDevice,
    IconLyrics,
    IconMiniPlayer,
    IconFullScreen,
    IconInLikeSong,
    ProcessBar,
    VolumeBar
  },
  data() {
    return {
      isMiniPlayer: false,
      isConnectToDevice: false,
      isQueen: false,
      isLyrics: false,
      isNowPlayingView: false
    }
  },
  computed: {
    ...mapState(useTrackStore, ['isPause', 'isShuffle', 'isRepeat', 'isMute', 'coverUrl', 'name', 'artist', 'volume', 'percentage'])
  },
  methods: {
    ...mapActions(useAppStore, ['toggleFullScreemPlayer'])
  }
}
</script>

<style lang="scss" scoped>
$cover-width: 56px;
$cover-height: 56px;
$msg-title-font-size: 1.4rem;
$msg-artist-font-size: 1.2rem;

.btn-active:nth-child(n) {
  fill: $color-brand;
  position: relative;

  &::before {
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

.player-bar {
  height: $height-player;
  margin-top: $gutter;
  display: flex;
  position: relative;

  &__left {
    flex: 3;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &__msg-wrapper {
      margin: 0 $gutter;

      &__title {
        font-size: $msg-title-font-size;
        // cursor: pointer;

        // &:hover {
        //   text-decoration: underline;
        // }
      }

      &__artist {
        font-size: $msg-artist-font-size;
        color: $color-font-secondary;
        // cursor: pointer;

        // &:hover {
        //   text-decoration: underline;
        //   color: $color-font-primary;
        // }
      }
    }

    &__cover-wrapper {
      width: $cover-width;
      height: $cover-height;
      margin: 0 $gutter;

      &__cover {
        width: 100%;
        object-fit: cover;
      }
    }
  }

  &__mid {
    flex: 4;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &__btn-group {
      display: flex;
      justify-content: center;
      gap: $gutter;
      margin-bottom: $gutter;

      &__play {
        height: 3.2rem;
        width: 3.2rem;
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

    &__bottom {
      display: flex;
      gap: $gutter;
      font-size: 1.2rem;
      color: $color-font-secondary;

      &__seek {
        min-width: 4rem;
        text-align: right;
      }

      &__duration {
        min-width: 4rem;
        text-align: left;
      }
    }
  }

  &__right {
    flex: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
