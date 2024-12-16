<template>
  <footer class="player-bar">
    <div class="player-bar__left">
      <div class="player-bar__left__cover-wrapper" v-if="current_track?.album?.images">
        <Image class="player-bar__left__cover-wrapper__cover" :src="current_track.album.images[0].url" alt="track" />
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
        <button v-tooltip="toolTipLike" class="icon-wrapper" v-if="current_track" @click="toggleTrackSave">
          <IconSaved v-if="isSaved" />
          <IconAddTo v-else />
        </button>
      </div>
    </div>
    <div class="player-bar__mid">
      <div class="player-bar__mid__btn-group">
        <button v-tooltip="toolTipShuffle" class="icon-wrapper"
          :class="{ 'btn-active': isShuffle, 'not-allowed': notAvaliable || isFreeAccount }" @click="toggleShuffle">
          <IconShuffle />
        </button>
        <button v-tooltip="$t('tooltip.previous')" class="icon-wrapper" @click="preTrack"
          :class="{ 'not-allowed': notAvaliable || isFreeAccount }">
          <IconPrevious />
        </button>
        <button v-tooltip="toolTipPlay" class="player-bar__mid__btn-group__play" @click="togglePlay"
          :class="{ 'not-allowed': notAvaliable }">
          <span class="player-bar__mid__btn-group__play__icon-wrapper-round">
            <IconPlay v-if="isPause" />
            <IconPause v-else />
          </span>
        </button>
        <button v-tooltip="$t('tooltip.next')" class="icon-wrapper" @click="nextTrack"
          :class="{ 'not-allowed': notAvaliable || isFreeAccount }">
          <IconNext />
        </button>
        <button v-tooltip="toolTipRepeat" class="icon-wrapper" :class="{
          'btn-active': repeatMode !== 0,
          'not-allowed': notAvaliable || isFreeAccount
        }" @click="setRepeatMode">
          <IconRepeatSingle v-if="repeatMode === 2" />
          <IconRepeat v-else />
        </button>
      </div>
      <SeekBar class="player-bar__mid__seek-bar" :disabled="notAvaliable" :draggable />
    </div>
    <div class="player-bar__right">
      <VolumeBar class="player-bar__right__volume-bar" :disabled="notAvaliable" />
      <button v-tooltip="$t('tooltip.fullscreen')" class="icon-wrapper player-bar__right__full-screen"
        @click="openFullScreenPlayer" :class="{ 'not-allowed': notAvaliable }" :disabled="notAvaliable">
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
import Image from '@/components/Image/index.vue'

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
    Image
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
      'volume',
      'isReady',
      'isSaved'
    ]),
    ...mapWritableState(useAppStore, ['showFullScreenPlayer']),
    isFreeAccount() {
      return useUserStore().checkProduct('free')
    },
    notAvaliable() {
      return !this.isReady
    },
    draggable() {
      return !!this.current_track
    },
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
    },
    toolTipLike() {
      if (this.isSaved) {
        return this.$t('tooltip.remove_from_liked_songs')
      }
      return this.$t('tooltip.add_to_liked_songs')
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

      &__cover {
        width: 100%;
        height: 100%;
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
