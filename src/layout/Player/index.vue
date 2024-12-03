<template>
  <footer class="player-bar">
    <template v-if="!loading">
      <div class="player-bar__left">
        <div class="player-bar__left__cover-wrapper" v-if="current_track?.album?.images">
          <div class="player-bar__left__cover-wrapper__arrow">
            <div class="player-bar__left__cover-wrapper__arrow__wrapper"
              @click="showFullScreenPlayer = !showFullScreenPlayer">
              <IconArrowUp v-show="!showFullScreenPlayer" />
              <IconArrowDown v-show="showFullScreenPlayer" />
            </div>
          </div>
          <img class="player-bar__left__cover-wrapper__cover" :src="current_track.album.images[0].url" alt="track" />
        </div>
        <div class="player-bar__left__msg-wrapper">
          <div class="player-bar__left__msg-wrapper__title" v-if="current_track?.id">
            <router-link :to="{ name: 'Track', params: { trackId: current_track.id } }">{{
              current_track.name
            }}</router-link>
          </div>
          <div class="player-bar__left__msg-wrapper__artist" v-if="current_track?.artists?.length">
            <router-link v-for="(artist, index) in current_track.artists" :key="artist.uri" :to="{
              name: 'Artist',
              params: { artistId: artist.uri.split(':')[artist.uri.split(':').length - 1] }
            }">
              {{ (index === 0 ? '' : ', ') + artist.name }}
            </router-link>
          </div>
        </div>
        <div class="player-bar__left__save-btn">
          <button class="icon-wrapper" v-if="current_track" @click="toggleTrackSave">
            <IconSaved v-if="isSaved" />
            <IconAddTo v-else />
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="player-bar__left">
        <div class="player-bar__left__cover-wrapper">
          <Skeleton class="skeleton__img" />
        </div>
        <div class="player-bar__left__msg-wrapper skeleton__msg-wrapper">
          <div class="player-bar__left__msg-wrapper__title">
            <Skeleton class="skeleton__title" />
          </div>
          <div class="player-bar__left__msg-wrapper__artist">
            <Skeleton class="skeleton__artists" />
          </div>
        </div>
        <div class="icon-wrapper player-bar__left__save-btn">
          <Skeleton shape="circle" />
        </div>
      </div>
    </template>
    <div class="player-bar__mid">
      <div class="player-bar__mid__btn-group">
        <button class="icon-wrapper" :class="{ 'btn-active': isShuffle, 'not-allowed': notAvaliable || isFreeAccount }"
          @click="toggleShuffle">
          <IconShuffle />
        </button>
        <button class="icon-wrapper" @click="preTrack" :class="{ 'not-allowed': notAvaliable || isFreeAccount }">
          <IconPrevious />
        </button>
        <button class="player-bar__mid__btn-group__play" @click="togglePlay" :class="{ 'not-allowed': notAvaliable }">
          <span class="player-bar__mid__btn-group__play__icon-wrapper-round">
            <IconPlay v-if="isPause" />
            <IconPause v-else />
          </span>
        </button>
        <button class="icon-wrapper" @click="nextTrack" :class="{ 'not-allowed': notAvaliable || isFreeAccount }">
          <IconNext />
        </button>
        <button class="icon-wrapper"
          :class="{ 'btn-active': repeatMode !== 0, 'not-allowed': notAvaliable || isFreeAccount }"
          @click="setRepeatMode">
          <IconRepeatSingle v-if="repeatMode === 2" />
          <IconRepeat v-else />
        </button>
      </div>
      <SeekBar class="player-bar__mid__seek-bar" :disabled="notAvaliable" />
    </div>
    <div class="player-bar__right">
      <VolumeBar class="player-bar__right__volume-bar" :disabled="notAvaliable" />
      <button class="icon-wrapper player-bar__right__full-screen" @click="openFullScreenPlayer"
        :class="{ 'not-allowed': notAvaliable }" :disabled="notAvaliable">
        <IconFullScreen />
      </button>
    </div>
  </footer>
</template>

<script>
import IconAddTo from '@/components/Icons/IconAddTo.vue'
import IconNext from '@/components/Icons/IconNext.vue'
import IconPause from '@/components/Icons/IconPause.vue'
import IconPlay from '@/components/Icons/IconPlay.vue'
import IconPrevious from '@/components/Icons/IconPrevious.vue'
import IconRepeat from '@/components/Icons/IconRepeat.vue'
import IconRepeatSingle from '@/components/Icons/IconRepeatSingle.vue'
import IconShuffle from '@/components/Icons/IconShuffle.vue'
import IconMiniPlayer from '@/components/Icons/IconMiniPlayer.vue'
import IconFullScreen from '@/components/Icons/IconFullScreen.vue'
import IconSaved from '@/components/Icons/IconSaved.vue'
import { mapActions, mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import VolumeBar from '@/components/VolumeBar/index.vue'
import SeekBar from '@/components/SeekBar/index.vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import Skeleton from '@/components/Skeleton/index.vue'
import IconArrowDown from '@/components/Icons/IconArrowDown.vue'
import IconArrowUp from '@/components/Icons/IconArrowUp.vue'

export default {
  name: 'Player',
  components: {
    IconPlay,
    IconPause,
    IconNext,
    IconPrevious,
    IconShuffle,
    IconRepeat,
    IconRepeatSingle,
    IconAddTo,
    IconMiniPlayer,
    IconFullScreen,
    IconSaved,
    VolumeBar,
    SeekBar,
    Skeleton,
    IconArrowDown,
    IconArrowUp
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
    ...mapWritableState(usePlayerStore, [
      'player',
      'current_track',
      'percentage',
      'isPause',
      'isShuffle',
      'repeatMode',
      'isMute',
      'volume',
      'isReady',
      'loading',
      'isSaved'
    ]),
    ...mapWritableState(useAppStore, ['showFullScreenPlayer']),
    isFreeAccount() {
      return useUserStore().checkProduct('free')
    },
    notAvaliable() {
      return !this.isReady || !this.current_track
    }
  },
  methods: {
    async openFullScreenPlayer() {
      await this.openFullscreen()
      this.showFullScreenPlayer = true
    },
    /* View in fullscreen */
    async openFullscreen() {
      let element = document.documentElement
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        /* Safari */
        await element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        /* IE11 */
        await element.msRequestFullscreen()
      }
    },
    ...mapActions(usePlayerStore, [
      'initPlayer',
      'togglePlay',
      'nextTrack',
      'preTrack',
      'setRepeatMode',
      'toggleShuffle',
      'toggleTrackSave'
    ])
  },
  created() {
    this.initPlayer()
  }
}
</script>

<style lang="scss" scoped>
$msg-title-font-size: 1.4rem;
$msg-artist-font-size: 1.2rem;

.skeleton {
  &__img {
    height: 100%;
    aspect-ratio: 1 / 1;
  }

  &__title {
    height: $font-size-text-primary;
    width: 100%;
    margin-bottom: calc($font-size-text-primary * 0.5);
  }

  &__artists {
    height: $font-size-text-secondary;
    width: 80%;
  }

  &__msg-wrapper {
    width: 20%;
  }
}

.not-allowed:nth-child(n) {
  cursor: not-allowed;
  opacity: 0.3;

  &:hover {
    transform: unset;
    fill: $color-font-secondary;
  }

  &:active {
    transform: unset;
    opacity: 0.3;
  }
}

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
  display: flex;
  position: relative;
  gap: $gutter-2x;

  &__left {
    flex: 3;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &__msg-wrapper {
      margin: 0 $gutter;

      &__title {
        font-size: $msg-title-font-size;

        @include oneLineEllipsis;
      }

      &__artist {
        font-size: $msg-artist-font-size;
        color: $color-font-secondary;

        @include oneLineEllipsis;
      }
    }

    &__cover-wrapper {
      flex-shrink: 0;
      height: 80%;
      aspect-ratio: 1 / 1;
      margin: 0 $gutter;
      position: relative;
      border-radius: $border-radius-small;
      overflow: hidden;

      &:hover &__arrow {
        display: block;
      }

      &__arrow {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 0.6rem;
        cursor: pointer;
        border-radius: 50%;
        background-color: $color-bg-3;
        opacity: 0.8;
        display: flex;
        justify-content: center;
        align-items: center;
        display: none;

        &__wrapper {
          height: 1.2rem;
          width: 1.2rem;
          fill: $color-font-secondary;
        }
      }

      &__cover {
        width: 100%;
        object-fit: cover;
        cursor: pointer;
      }
    }

    &__save-btn {
      flex-shrink: 0;
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
      align-items: center;
      gap: $gutter;
      margin-bottom: $gutter;

      &__play {
        height: calc($height-player * 0.5);
        width: calc($height-player * 0.5);
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
          height: 50%;
          width: 50%;
        }
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
