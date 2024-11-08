<template>
  <template v-if="!loading">
    <div v-if="item !== null" class="track-card">
      <div class="track-card__left">
        <div v-if="item.id !== null" class="track-card__left__icon-wrapper">
          <button class="track-card__left__icon-wrapper__icon" @click="handleTogglePlay">
            <IconPause v-if="!isPause && item.uri === current_track.uri" />
            <IconPlay v-else />
          </button>
        </div>
        <div class="track-card__left__num-wrapper">
          <div
            class="track-card__left__num-wrapper__playing"
            v-if="!isPause && current_track.uri === item.uri"
          >
            <img
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
            class="track-card__title__cover-wrapper__cover"
            :src="item.album.images[2].url"
            alt="Album Cover"
          />
        </div>
        <div class="track-card__title__msg-wrapper">
          <router-link
            :class="{
              'track-card__title__msg-wrapper__name-playing':
                !isPause && current_track.uri === item.uri
            }"
            v-if="item.id !== null"
            :to="{ name: 'Track', params: { trackId: item.id } }"
            class="track-card__title__msg-wrapper__name"
          >
            {{ item.name }}
          </router-link>
          <span v-else class="track-card__title__msg-wrapper__name"> {{ item.name }}</span>
          <div v-if="showArtists" class="track-card__title__msg-wrapper__artists">
            <router-link
              v-if="item.id !== null"
              v-for="(artist, index) in item.artists"
              :key="artist.id"
              :to="{ name: 'Artist', params: { artistId: artist.id } }"
            >
              {{ (index === 0 ? '' : ', ') + artist.name }}
            </router-link>
            <span
              v-else
              class="track-card__title__msg-wrapper__artists"
              v-for="(artist, index) in item.artists"
            >
              {{ (index === 0 ? '' : ', ') + artist.name }}</span
            >
          </div>
        </div>
      </div>
      <div v-if="showAlbum" class="track-card__album-wrapper">
        <router-link
          v-if="item.id !== null"
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
      <div v-if="item.id === null" class="track-card__cover"></div>
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
        <div class="track-card__title__cover-wrapper">
          <Skeleton />
        </div>
        <div class="track-card__title__msg-wrapper">
          <Skeleton class="skeleton__msg" />
          <Skeleton class="skeleton__artists" />
        </div>
      </div>
      <div class="track-card__album-wrapper">
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

export default {
  name: 'CardTrack',
  components: {
    IconPlay,
    IconPause,
    Skeleton
  },
  computed: {
    ...mapState(usePlayerStore, ['current_track', 'isPause'])
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
    display: flex;
  }

  &:hover .track-card__left__icon-wrapper {
    display: none;
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

  @include respond(phone) {
    padding: 0;
  }

  &:hover {
    background-color: $color-bg-5;
  }

  &:hover &__left__num-wrapper {
    display: none;
  }

  &:hover &__left__icon-wrapper {
    display: flex;
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

    &__num-wrapper {
      font-size: $font-size-text-primary;
      position: absolute;
      top: 0;
      right: 2.4rem;
      height: 100%;
      display: flex;
      align-items: center;

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
      display: none;
      align-items: center;

      &__icon {
        height: 1.6rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-primary;

        @include clickAnimation;
      }
    }

    @include respond(phone) {
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

      &__artists {
        font-size: $font-size-text-secondary;

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

  &__cover {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: $color-bg-2;
    opacity: 0.7;
  }
}
</style>
