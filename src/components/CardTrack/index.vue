<template>
  <template v-if="!loading">
    <div
      ref="trackCard"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="handleClick"
      class="track-card"
      :class="[{ 'track-card-not-available': !available }, { 'track-card-active': active }]"
    >
      <div class="track-card__left">
        <template v-if="available">
          <div v-if="active" class="track-card__left__icon-wrapper">
            <button class="track-card__left__icon-wrapper__icon" @click="handleTogglePlay">
              <IconPause v-if="isPlaying" />
              <IconPlay v-else />
            </button>
          </div>
          <div v-if="!active" class="track-card__left__num-wrapper">
            <div class="track-card__left__num-wrapper__playing" v-if="isPlaying">
              <i class="track-card__left__num-wrapper__playing__icon"></i>
            </div>
            <span v-else>{{ index + 1 }}</span>
          </div>
        </template>

        <template v-else>
          <div class="track-card__left__num-wrapper-not-avialable">
            <span>{{ index + 1 }}</span>
          </div>
        </template>
      </div>
      <div class="track-card__title">
        <router-link
          v-if="showImage && !!item?.id"
          :to="{ name: 'Track', params: { trackId: item.id } }"
          class="track-card__title__cover-wrapper"
        >
          <Image
            class="track-card__title__cover-wrapper__cover"
            :src="item.album.images[2].url"
            alt="Album Cover"
            no-scale
          />
        </router-link>
        <div class="track-card__title__msg-wrapper">
          <router-link
            v-if="!!item?.id"
            :class="{
              'track-card__title__msg-wrapper__name-playing': isCurrent
            }"
            :to="{ name: 'Track', params: { trackId: item.id } }"
            class="track-card__title__msg-wrapper__name"
          >
            {{ item.name }}
          </router-link>
          <span v-else class="track-card__title__msg-wrapper__name"> {{ item.name }}</span>
          <div v-if="showArtists" class="track-card__title__msg-wrapper__artists">
            <template v-for="(artist, index) in item.artists" :key="artist.id">
              <router-link
                v-if="!!artist.id"
                :to="{ name: 'Artist', params: { artistId: artist.id } }"
              >
                {{ (index === 0 ? '' : ', ') + artist.name }}
              </router-link>
              <span v-else> {{ (index === 0 ? '' : ', ') + artist.name }}</span>
            </template>
          </div>
        </div>
      </div>
      <div v-if="showAlbum" class="track-card__album-wrapper">
        <router-link
          v-if="!!item.album?.id"
          :to="{ name: 'Album', params: { albumId: item.album.id } }"
          class="track-card__album-wrapper__album"
          >{{ item.album.name }}</router-link
        >
        <span v-else class="track-card__album-wrapper__album">
          {{ item.album?.name }}
        </span>
      </div>
      <div class="track-card__duration-wrapper">
        <span>{{ getFormatTime(item.duration_ms) }}</span>
      </div>
      <div class="track-card__more-wrapper">
        <DropDownMenu
          @update-succeed="handleUpdateSucceed"
          :playlist
          v-show="active"
          :track="item"
          :active
        />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="track-card no-hover">
      <div class="track-card__left">
        <div class="track-card__left__num-wrapper">
          <Skeleton class="skeleton__num" />
        </div>
      </div>
      <div class="track-card__title">
        <div class="track-card__title__cover-wrapper" v-if="showImage">
          <Skeleton />
        </div>
        <div class="track-card__title__msg-wrapper">
          <Skeleton class="skeleton__msg" />
          <Skeleton class="skeleton__artists" v-if="showArtists" />
        </div>
      </div>
      <div class="track-card__album-wrapper" v-if="showAlbum">
        <Skeleton class="skeleton__album" />
      </div>
      <div class="track-card__duration-wrapper">
        <Skeleton class="skeleton__duration" />
      </div>
      <div class="track-card__more-wrapper"></div>
    </div>
  </template>
</template>

<script>
import IconPlay from '@/components/Icons/IconPlay.vue'
import { timeFormatTrack } from '@/utils/time_format'
import IconPause from '../Icons/IconPause.vue'
import { mapActions, mapState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import Skeleton from '@/components/Skeleton/index.vue'
import { useLibraryStore } from '@/stores/library'
import Image from '@/components/Image/index.vue'
import DropDownMenu from './DropDownMenu/index.vue'

export default {
  name: 'CardTrack',
  components: {
    IconPlay,
    IconPause,
    Skeleton,
    Image,
    DropDownMenu
  },
  computed: {
    ...mapState(usePlayerStore, ['current_track', 'active_pause']),
    ...mapState(useLibraryStore, ['isCollasped']),
    available() {
      if (this.item?.restrictions) {
        return !this.item?.restrictions
      }
      return true
    },
    isPlaying() {
      return !this.active_pause && this.isCurrent
    },
    isCurrent() {
      return this.current_track?.uri === this.item.uri
    },
    active() {
      return this.hover || this.focus
    }
  },
  data() {
    return {
      hover: false,
      focus: false
    }
  },
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    },
    showArtists: {
      type: Boolean,
      default: true
    },
    showImage: {
      type: Boolean,
      default: true
    },
    showAlbum: {
      type: Boolean,
      default: true
    },
    context_uri: {
      type: String,
      default: undefined
    },
    uris: {
      type: Array,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: false
    },
    playlist: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    handleUpdateSucceed(trackId) {
      this.$emit('updateSucceed', trackId)
    },
    handleClick() {
      this.focus = true
      document.addEventListener('mouseup', this.hide)
    },
    hide(e) {
      if (!this.$refs.trackCard) {
        document.removeEventListener('mouseup', this.hide)
      } else if (!this.$refs.trackCard.contains(e.target)) {
        this.focus = false
        document.removeEventListener('mouseup', this.hide)
      }
    },
    ...mapActions(usePlayerStore, ['togglePlay', 'playNewTrack']),
    getFormatTime(time) {
      return timeFormatTrack(time)
    },
    async handleTogglePlay() {
      // Current track
      if (this.isCurrent) {
        await this.togglePlay()
      } else {
        // New track
        let data
        if (this.context_uri) {
          data = {
            context_uri: this.context_uri,
            offset: { position: this.index }
          }
        } else if (this.uris) {
          data = {
            uris: this.uris,
            offset: { position: this.index }
          }
        } else {
          data = {
            uris: [this.item.uri]
          }
        }
        await this.playNewTrack(data, this.item)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.no-hover:nth-child(n) {
  &:hover {
    background-color: unset;
  }
}

.skeleton {
  &__num {
    width: 1.6rem;
    height: $font-size-text-primary;
  }

  &__msg {
    height: $font-size-text-primary;
    width: 30%;
  }

  &__artists {
    height: $font-size-text-secondary;
    width: 50%;
    margin-top: calc($font-size-text-secondary * 0.5);
  }

  &__album {
    height: $font-size-text-secondary;
    width: 30%;
  }

  &__duration {
    height: $font-size-text-secondary;
    width: 100%;
  }
}

.track-card {
  display: flex;
  height: 5.6rem;
  font-size: $font-size-text-secondary;
  color: $color-font-secondary;
  border-radius: $border-radius-small;
  position: relative;
  transition-property: opacity, background-color, color;
  transition-duration: $duration-default;
  transition-timing-function: ease;

  &-active {
    background-color: $color-bg-3;
  }

  &-not-available {
    opacity: 0.5;
  }

  &__left {
    flex-basis: 4.8rem;
    position: relative;

    &__num-wrapper,
    &__num-wrapper-not-avialable {
      font-size: $font-size-text-primary;
      position: absolute;
      top: 0;
      right: 2rem;
      height: 100%;
      display: flex;
      align-items: center;

      @include transition;

      &__playing {
        height: 1.4rem;
        aspect-ratio: 1 / 1;

        &__icon {
          display: block;
          background: url(/src/assets/images/playing.gif);
          background-size: cover;
          height: 100%;
          aspect-ratio: 1 / 1;
        }
      }
    }

    &__icon-wrapper {
      height: 100%;
      display: flex;
      align-items: center;
      z-index: 1;
      position: absolute;
      top: 0;
      right: 1.8rem;

      &__icon {
        height: 1.4rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-primary;

        @include clickAnimation;
      }
    }
  }

  &__title {
    height: 100%;
    flex: 1;
    display: flex;
    justify-content: start;
    align-items: center;

    &__cover-wrapper {
      display: block;
      height: 70%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      margin-right: $gutter;
      flex-shrink: 0;
      background-color: $color-bg-3;
      position: relative;

      &__cover {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border-radius: $border-radius-small;
      }
    }

    &__msg-wrapper {
      flex-shrink: 1;
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      line-height: initial;
      height: 80%;
      width: 100%;
      padding-right: 1rem;

      @include respondContainer(phone) {
        padding-right: unset;
      }

      &__name {
        font-size: $font-size-text-primary;
        color: $color-font-primary;

        @include oneLineEllipsis;

        &-playing {
          color: $color-brand;
        }
      }

      &__artists,
      &__artists-not-available {
        font-size: $font-size-text-secondary;

        @include transition;

        @include oneLineEllipsis;
      }
    }
  }

  &__album-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;

    &__album {
      font-size: $font-size-text-secondary;
      padding-right: 1rem;

      @include transition;

      @include oneLineEllipsis;
    }

    @include respondContainer(phone) {
      display: none;
    }
  }

  &__duration-wrapper {
    flex-basis: 3.6rem;
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
    font-size: $font-size-text-secondary;

    @include respondContainer(phone) {
      display: none;
    }
  }

  &__more-wrapper {
    flex-basis: 4.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
