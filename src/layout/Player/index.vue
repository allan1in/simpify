<template>
  <footer class="player-bar">
    <div class="player-bar__left">
      <div class="player-bar__left__cover-wrapper" v-if="current_track?.album?.images">
        <img
          class="player-bar__left__cover-wrapper__cover"
          :src="current_track.album.images[0].url"
          alt="track"
          @click="showFullScreenPlayer = true"
        />
      </div>
      <div class="player-bar__left__msg-wrapper">
        <div class="player-bar__left__msg-wrapper__title" v-if="current_track?.id">
          <router-link :to="{ name: 'Track', params: { trackId: current_track.id } }">{{
            current_track.name
          }}</router-link>
        </div>
        <div class="player-bar__left__msg-wrapper__artist" v-if="current_track?.artists?.length">
          <router-link
            v-for="(artist, index) in current_track.artists"
            :key="artist.uri"
            :to="{
              name: 'Artist',
              params: { artistId: artist.uri.split(':')[artist.uri.split(':').length - 1] }
            }"
          >
            {{ (index === 0 ? '' : ', ') + artist.name }}
          </router-link>
        </div>
      </div>
      <!-- <button class="icon-wrapper" @click="song.isLike = !song.isLike">
        <IconInLikeSong v-if="song.isLike" />
        <IconAddToLikeSong v-else />
      </button> -->
    </div>
    <div class="player-bar__mid">
      <div class="player-bar__mid__btn-group">
        <button
          class="icon-wrapper"
          :class="{ 'btn-active': isShuffle, 'not-allowed': !isReady }"
          @click="toggleShuffle"
          :disabled="!isReady"
        >
          <IconShuffle />
        </button>
        <button
          class="icon-wrapper"
          @click="preTrack"
          :class="{ 'not-allowed': !isReady }"
          :disabled="!isReady"
        >
          <IconPrevious />
        </button>
        <button
          class="player-bar__mid__btn-group__play"
          @click="togglePlay"
          :class="{ 'not-allowed': !isReady }"
          :disabled="!isReady"
        >
          <span class="player-bar__mid__btn-group__play__icon-wrapper-round">
            <IconPlay v-if="isPause" />
            <IconPause v-else />
          </span>
        </button>
        <button
          class="icon-wrapper"
          @click="nextTrack"
          :class="{ 'not-allowed': !isReady }"
          :disabled="!isReady"
        >
          <IconNext />
        </button>
        <button
          class="icon-wrapper"
          :class="{ 'btn-active': repeatMode !== 0, 'not-allowed': !isReady }"
          @click="setRepeatMode"
          :disabled="!isReady"
        >
          <IconRepeatSingle v-if="repeatMode === 2" />
          <IconRepeat v-else />
        </button>
      </div>
      <SeekBar class="player-bar__mid__seek-bar" :disabled="!isReady" />
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
      <VolumeBar class="player-bar__right__volume-bar" :disabled="!isReady" />
      <!-- <button class="icon-wrapper" :class="{ 'btn-active': isMiniPlayer }" @click="isMiniPlayer = !isMiniPlayer">
        <IconMiniPlayer />
      </button> -->
      <button
        class="icon-wrapper player-bar__right__full-screen"
        @click="openFullScreenPlayer"
        :class="{ 'not-allowed': !isReady }"
        :disabled="!isReady"
      >
        <IconFullScreen />
      </button>
      <button
        class="icon-wrapper player-bar__right__play-phone"
        @click="togglePlay"
        :class="{ 'not-allowed': !isReady }"
        :disabled="!isReady"
      >
        <IconPlay v-if="isPause" />
        <IconPause v-else />
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
import IconRepeatSingle from '@/components/Icons/IconRepeatSingle.vue'
import IconShuffle from '@/components/Icons/IconShuffle.vue'
import IconNowPlayingView from '@/components/Icons/IconNowPlayingView.vue'
import IconQueen from '@/components/Icons/IconQueen.vue'
import IconConnectToDevice from '@/components/Icons/IconConnectToDevice.vue'
import IconLyrics from '@/components/Icons/IconLyrics.vue'
import IconMiniPlayer from '@/components/Icons/IconMiniPlayer.vue'
import IconFullScreen from '@/components/Icons/IconFullScreen.vue'
import IconInLikeSong from '@/components/Icons/IconInLikeSong.vue'
import { mapActions, mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import VolumeBar from '@/components/VolumeBar/index.vue'
import SeekBar from '@/components/SeekBar/index.vue'

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
    IconAddToLikeSong,
    IconNowPlayingView,
    IconQueen,
    IconConnectToDevice,
    IconLyrics,
    IconMiniPlayer,
    IconFullScreen,
    IconInLikeSong,
    VolumeBar,
    SeekBar
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
      'showFullScreenPlayer',
      'isReady'
    ])
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
      'toggleShuffle'
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

  &__left {
    flex: 3;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    @include respond(phone) {
      flex: unset;
      flex-grow: 1;
    }

    &__msg-wrapper {
      margin: 0 $gutter;

      &__title {
        font-size: $msg-title-font-size;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }

        @include oneLineEllipsis;
      }

      &__artist {
        font-size: $msg-artist-font-size;
        color: $color-font-secondary;

        @include oneLineEllipsis;
      }
    }

    &__cover-wrapper {
      height: 80%;
      aspect-ratio: 1 / 1;
      margin: 0 $gutter;

      &__cover {
        width: 100%;
        object-fit: cover;
        cursor: pointer;
      }
    }
  }

  &__mid {
    flex: 4;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @include respond(phone) {
      flex: 10;
    }

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

    @include respond(phone) {
      display: none;
    }
  }

  &__right {
    flex: 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    @include respond(phone) {
      flex: unset;
      flex-shrink: 0;
    }

    &__volume-bar,
    &__full-screen {
      @include respond(phone) {
        display: none;
      }
    }

    &__play-phone {
      display: none;

      @include respond(phone) {
        display: block;
        height: 4.4rem;
        width: 4.4rem;
        margin: 0 1.6rem;
        fill: $color-font-primary;
      }
    }
  }
}
</style>
