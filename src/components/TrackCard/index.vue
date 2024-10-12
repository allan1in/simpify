<template>
  <div class="track-card">
    <div class="track-card__left">
      <div class="track-card__left__num-wrapper">
        <span>{{ index + 1 }}</span>
      </div>
      <div class="track-card__left__icon-wrapper">
        <button class="track-card__left__icon-wrapper__icon">
          <IconPlay />
        </button>
      </div>
    </div>

    <div class="track-card__title">
      <div class="track-card__title__cover-wrapper">
        <img
          class="track-card__title__cover-wrapper__cover"
          :src="item.album.images[2].url"
          alt="Album Cover"
        />
      </div>
      <div class="track-card__title__msg-wrapper">
        <router-link
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
    <div class="track-card__album-wrapper">
      <router-link
        :to="{ name: 'Album', params: { albumId: item.album.id } }"
        class="track-card__album-wrapper__album"
        >{{ item.album.name }}</router-link
      >
    </div>
    <div class="track-card__duration-wrapper">
      <span>{{ timeFormat(item.duration_ms) }}</span>
    </div>
  </div>
</template>

<script>
import IconPlay from '@/components/Icons/IconPlay.vue'
export default {
  name: 'TrackCard',
  components: {
    IconPlay
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
    }
  },
  methods: {
    timeFormat(time) {
      let min = Math.floor(time / 1000 / 60)
      let sec = Math.floor((time / 1000) % 60)
      return `${min > 59 ? '59' : (min + '').length === 1 ? '0' + min : min}:${(sec + '').length === 1 ? '0' + sec : sec}`
    }
  }
}
</script>

<style lang="scss" scoped>
.track-card {
  padding: 0 2.4rem;
  display: flex;
  height: 5.6rem;
  font-size: 1.4rem;
  color: $color-font-secondary;
  border-radius: $border-radius-small;

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

    &__num-wrapper {
      font-size: 1.6rem;
      display: flex;
      align-items: center;
      height: 100%;
    }

    &__icon-wrapper {
      height: 100%;
      display: none;
      align-items: center;

      &__icon {
        height: 1.5rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-primary;

        @include clickAnimation;
      }
    }
  }

  &__title {
    height: 100%;
    flex: 8;
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

      &__name {
        font-size: 1.6rem;
        color: $color-font-primary;

        @include oneLineEllipsis;
      }

      &__artists {
        @include oneLineEllipsis;
      }
    }
  }

  &__album-wrapper {
    flex: 8;
    display: flex;
    align-items: center;
    height: 100%;

    &__album {
      @include oneLineEllipsis;
    }
  }

  &__duration-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>
