<template>
  <template v-if="!loading">
    <template v-if="available">
      <div v-if="item !== null" class="track-card">
        <div class="track-card__left">
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
        </div>

        <div class="track-card__title">
          <div v-if="showImage" class="track-card__title__cover-wrapper">
            <img
              loading="lazy"
              class="track-card__title__cover-wrapper__cover"
              :src="item.album.images[2].url"
              alt="Album Cover"
            />
          </div>
          <div class="track-card__title__msg-wrapper">
            <router-link
              :class="{
                'track-card__title__msg-wrapper__name-playing': isPlaying
              }"
              :to="{ name: 'Track', params: { trackId: item.id } }"
              class="track-card__title__msg-wrapper__name"
            >
              {{ item.name }}
            </router-link>
            <div v-if="showArtists" class="track-card__title__msg-wrapper__artists">
              <router-link
                v-for="(artist, index) in item.artists"
                :key="artist.id"
                :to="{ name: 'Artist', params: { artistId: artist.id } }"
              >
                {{ (index === 0 ? '' : ', ') + artist.name }}
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="showAlbum" class="track-card__album-wrapper">
          <router-link
            :to="{ name: 'Album', params: { albumId: item.album.id } }"
            class="track-card__album-wrapper__album"
            >{{ item.album.name }}</router-link
          >
        </div>
        <div class="track-card__duration-wrapper">
          <span>{{ getFormatTime(item.duration_ms) }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="item !== null" class="track-card track-card-not-available">
        <div class="track-card__left">
          <div class="track-card__left__num-wrapper-not-avialable">
            <span>{{ index + 1 }}</span>
          </div>
        </div>

        <div class="track-card__title">
          <div v-if="showImage" class="track-card__title__cover-wrapper">
            <img
              loading="lazy"
              class="track-card__title__cover-wrapper__cover"
              :src="item.album.images[2].url"
              alt="Album Cover"
            />
          </div>
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
            <div v-if="showArtists" class="track-card__title__msg-wrapper__artists-not-available">
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
            v-if="!!item.album.id"
            :to="{ name: 'Album', params: { albumId: item.album.id } }"
            class="track-card__album-wrapper__album"
            >{{ item.album.name }}</router-link
          >
          <span v-else class="track-card__album-wrapper__album">
            {{ item.album.name }}
          </span>
        </div>
        <div class="track-card__duration-wrapper">
          <span>{{ getFormatTime(item.duration_ms) }}</span>
        </div>
      </div>
    </template>
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
import { useUserStore } from '@/stores/user'

export default {
  name: 'CardTrack',
  components: {
    IconPlay,
    IconPause,
    Skeleton
  },
  computed: {
    ...mapState(usePlayerStore, ['current_track', 'isPause']),
    available() {
      if (useUserStore().checkProduct('premium')) {
        return !this.item?.restrictions
      } else if (useUserStore().checkProduct('free')) {
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
    showArtists: {
      type: Boolean,
      require: false,
      default: true
    },
    showImage: {
      type: Boolean,
      require: false,
      default: true
    },
    showAlbum: {
      type: Boolean,
      require: false,
      default: true
    },
    context_uri: {
      type: String,
      require: false,
      default: undefined
    },
    uris: {
      type: Array,
      require: false,
      default: undefined
    },
    loading: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  methods: {
    getFormatTime(time) {
      return timeFormatTrack(time)
    },
    async handleTogglePlay() {
      // Current track
      if (this.current_track.uri === this.item.uri) {
        this.togglePlay()
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
        this.playNewTrack(data, this.item)
      }
    },
    ...mapActions(usePlayerStore, ['togglePlay', 'playNewTrack'])
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
  margin: 0 1.6rem;
  padding: 0 2.4rem;
  display: flex;
  height: 5.6rem;
  font-size: $font-size-text-secondary;
  color: $color-font-secondary;
  border-radius: $border-radius-small;
  position: relative;

  @include transition;

  @include respond(phone) {
    padding: 0 1.6rem;
    margin: 0;
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

  &:hover &__album-wrapper__album {
    color: $color-font-primary;
  }

  &__left {
    flex-basis: 3.6rem;
    position: relative;

    &__num-wrapper,
    &__num-wrapper-not-avialable {
      font-size: $font-size-text-primary;
      position: absolute;
      top: 0;
      right: 2.4rem;
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
      position: relative;
      z-index: 100;

      @include transition;

      &__icon {
        height: 1.6rem;
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
      height: 80%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      border-radius: $border-radius-small;
      margin-right: 1.2rem;
      flex-shrink: 0;
      background-color: $color-bg-3;

      &__cover {
        height: 100%;
        width: 100%;
        object-fit: cover;
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

    @include respond(phone) {
      display: none;
    }
  }

  &__duration-wrapper {
    flex-basis: 7.2rem;
    display: flex;
    align-items: center;
    height: 100%;
    font-size: $font-size-text-secondary;

    @include respond(phone) {
      display: none;
    }
  }
}
</style>
