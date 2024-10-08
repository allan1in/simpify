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
          :src="item.album.images[1].url"
          alt="Album Cover"
        />
      </div>
      <div class="track-card__title__msg-wrapper">
        <div class="track-card__title__msg-wrapper__name">
          {{ item.name }}
        </div>
        <div class="track-card__title__msg-wrapper__artists">
          {{
            item.artists.reduce(
              (acc, artist, index) =>
                index !== 0 ? acc + ', ' + artist.name : item.artists[0].name,
              ''
            )
          }}
        </div>
      </div>
    </div>
    <div class="track-card__album-wrapper">
      <span>{{ item.album.name }}</span>
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

      &__cover {
        max-height: 100%;
        object-fit: contain;
      }
    }

    &__msg-wrapper {
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: space-between;
      line-height: initial;
      height: 80%;

      &__name {
        font-size: 1.6rem;
        color: $color-font-primary;
      }
    }
  }

  &__album-wrapper {
    flex: 8;
    display: flex;
    align-items: center;
    height: 100%;
  }

  &__duration-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>
