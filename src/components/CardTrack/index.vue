<template>
  <template v-if="!loading">
    <div class="track-card" :class="{ 'track-card-not-available': !available }">
      <div v-if="showNumber" class="track-card__left">
        <template v-if="available">
          <div class="track-card__left__icon-wrapper">
            <button class="track-card__left__icon-wrapper__icon" @click="handleTogglePlay">
              <IconPause v-if="isPlaying" />
              <IconPlay v-else />
            </button>
          </div>
          <div class="track-card__left__num-wrapper">
            <div class="track-card__left__num-wrapper__playing" v-if="isPlaying">
              <img
                loading="lazy"
                class="track-card__left__num-wrapper__playing__img"
                src="/src/assets/images/playing.gif"
                alt=""
              />
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
          v-if="showImage"
          :to="{ name: 'Track', params: { trackId: item.id } }"
          class="track-card__title__cover-wrapper"
        >
          <template v-if="!showNumber">
            <div class="track-card__title__cover-wrapper__icon-wrapper">
              <button
                class="track-card__title__cover-wrapper__icon-wrapper__icon"
                @click.prevent="handleTogglePlay"
              >
                <IconPause v-if="isPlaying" />
                <IconPlay v-else />
              </button>
            </div>
          </template>
          <img
            loading="lazy"
            class="track-card__title__cover-wrapper__cover"
            :src="item.album.images[2].url"
            alt="Album Cover"
          />
        </router-link>
        <div class="track-card__title__msg-wrapper">
          <router-link
            v-if="!!item.id"
            :class="{
              'track-card__title__msg-wrapper__name-playing': isPlaying
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
    </div>
  </template>
  <template v-else>
    <div class="track-card no-hover">
      <div v-if="showNumber" class="track-card__left">
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
    </div>
  </template>
</template>

<script>
import IconPlay from '@/components/Icons/IconPlay.vue'
import { timeFormatTrack } from '@/utils/time_format'
import IconPause from '../Icons/IconPause.vue'
import { mapState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import Skeleton from '@/components/Skeleton/index.vue'
import { useLibraryStore } from '@/stores/library'

export default {
  name: 'CardTrack',
  components: {
    IconPlay,
    IconPause,
    Skeleton
  },
  computed: {
    ...mapState(usePlayerStore, ['current_track', 'isPause']),
    ...mapState(useLibraryStore, ['isCollasped']),
    available() {
      if (this.item?.restrictions) {
        return !this.item?.restrictions
      } else {
        return !!this.item?.preview_url
      }
    },
    isPlaying() {
      return !this.isPause && this.current_track.uri === this.item.uri
    }
  },
  props: {
    item: {
      type: Object,
      require: true
    },
    index: {
      type: Number,
      require: true
    },
    showNumber: {
      type: Boolean,
      default: true
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
    }
  },
  methods: {
    getFormatTime(time) {
      return timeFormatTrack(time)
    },
    async handleTogglePlay() {
      usePlayerStore().trackTogglePlay(this.item, this.context_uri, this.uris, this.index)
    }
  }
}
</script>

<style lang="scss" scoped>
.no-hover:nth-child(n) {
  &:hover {
    background-color: unset;
  }

  &:hover .track-card__left__num-wrapper {
    opacity: 1;
  }

  &:hover .track-card__left__icon-wrapper {
    opacity: 0;
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
  padding-left: 0.6rem;
  display: flex;
  height: 5.6rem;
  font-size: $font-size-text-secondary;
  color: $color-font-secondary;
  border-radius: $border-radius-small;
  position: relative;
  transition-property: opacity, background-color, color;
  transition-duration: $duration-default;
  transition-timing-function: ease;

  @include respondContainer(collasped) {
    padding: 0;
  }

  &-not-available {
    opacity: 0.5;
  }

  &:hover {
    background-color: $color-bg-5;
  }

  &:hover &__left__num-wrapper {
    opacity: 0;
  }

  &:hover &__left__icon-wrapper {
    opacity: 1;
  }

  &:hover &__title__msg-wrapper__artists {
    color: $color-font-primary;
  }

  &:hover &__title__cover-wrapper__icon-wrapper {
    opacity: 1;
  }

  &:hover &__album-wrapper__album {
    color: $color-font-primary;
  }

  &__left {
    flex-basis: 5.6rem;
    position: relative;

    &__num-wrapper,
    &__num-wrapper-not-avialable {
      font-size: $font-size-text-primary;
      position: absolute;
      top: 0;
      right: 2.8rem;
      height: 100%;
      display: flex;
      align-items: center;

      @include transition;

      &__playing {
        height: 1.4rem;
        aspect-ratio: 1 / 1;

        &__img {
          display: block;
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }

    &__icon-wrapper {
      height: 100%;
      opacity: 0;
      display: flex;
      align-items: center;
      z-index: 1;
      position: absolute;
      top: 0;
      right: 2.4rem;

      @include transition;

      &__icon {
        height: 1.6rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-primary;

        @include clickAnimation;
      }
    }

    @include respondContainer(collasped) {
      display: none;
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
      height: 80%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      margin-right: 1.2rem;
      flex-shrink: 0;
      background-color: $color-bg-3;
      position: relative;

      @include respondContainer(collasped) {
        height: 100%;
        padding: $gutter;
        background-color: unset;
        margin-right: 0;
      }

      &__icon-wrapper {
        width: 1.8rem;
        aspect-ratio: 1 / 1;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        z-index: 1;

        &__icon {
          display: block;
          width: 100%;
          height: 100%;
          fill: $color-font-primary;
        }
      }

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

      @include respondContainer(collasped) {
        display: none;
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

    @include respondContainer(collasped) {
      display: none;
    }

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
    flex-basis: 7.2rem;
    display: flex;
    align-items: center;
    height: 100%;
    font-size: $font-size-text-secondary;

    @include respondContainer(phone) {
      display: none;
    }

    @include respondContainer(collasped) {
      display: none;
    }
  }
}
</style>
