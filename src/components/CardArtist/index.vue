<template>
  <template v-if="!loading">
    <div class="artist-card" @click="$router.push({ name: 'Artist', params: { artistId: item.id } })">
      <div class="artist-card__img-box">
        <div class="artist-card__img-box__img-wrapper">
          <img loading="lazy" v-if="item.images[1]" :src="item.images[1].url" alt="Artist Cover"
            class="artist-card__img-box__img-wrapper__img" />
          <div v-else class="artist-card__img-box__img-wrapper__icon-wrapper">
            <IconDefaultArtist />
          </div>
        </div>
        <div class="artist-card__img-box__toggle-play" :class="{
          'artist-card__img-box__toggle-play-playing': !isPause && item.uri === context.uri
        }">
          <ButtonTogglePlay :item />
        </div>
      </div>

      <div class="artist-card__name-wrapper">
        <router-link :to="{ name: 'Artist', params: { artistId: item.id } }" class="artist-card__name-wrapper__name">{{
          item.name }}</router-link>
        <!-- <div class="artist-card__name-wrapper__type">
          {{ `${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}` }}
        </div> -->
      </div>
    </div>
  </template>
  <template v-else>
    <div class="artist-card no-hover">
      <div class="artist-card__img-box">
        <div class="artist-card__img-box__img-wrapper">
          <Skeleton />
        </div>
      </div>
      <div class="artist-card__name-wrapper">
        <Skeleton class="skeleton__name" />
        <Skeleton class="skeleton__type" />
      </div>
    </div>
  </template>
</template>

<script>
import IconDefaultArtist from '@/components/Icons/IconDefaultArtist.vue'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import { mapState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'CardArtist',
  components: {
    IconDefaultArtist,
    ButtonTogglePlay,
    Skeleton
  },
  props: {
    item: {
      type: Object,
      require: true
    },
    loading: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['isPause', 'context'])
  }
}
</script>

<style lang="scss" scoped>
.no-hover:nth-child(n) {
  cursor: unset;

  &:hover {
    background-color: unset;
  }
}

.skeleton {
  &__name {
    height: $font-size-text-primary;
    width: 80%;
  }

  &__type {
    height: $font-size-text-secondary;
    width: 40%;
    margin-top: calc($font-size-text-secondary * 0.5);
  }
}

.artist-card {
  border-radius: $border-radius-default;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem;
  cursor: pointer;
  position: relative;

  @include transition;

  &:hover {
    background-color: $color-bg-3;
  }

  &:hover &__img-box__toggle-play {
    opacity: 1;
    transform: translateY(0);
  }

  &__img-box {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;

    &__img-wrapper {
      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      background-color: $color-bg-3;
      box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.2);

      &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &__icon-wrapper {
        width: 30%;
        aspect-ratio: 1 / 1;
        fill: $color-bg-7;
      }
    }

    &__toggle-play {
      width: 25%;
      aspect-ratio: 1 / 1;
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      z-index: 10;
      opacity: 0;
      transform: translateY(1rem);

      @include transition;

      &-playing {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }

  &__name-wrapper {
    width: 100%;
    padding-top: 1.2rem;

    &__name {
      font-size: $font-size-text-primary;

      @include oneLineEllipsis;
    }

    &__type {
      font-size: $font-size-text-secondary;
      color: $color-font-secondary;

      @include oneLineEllipsis;
    }
  }
}
</style>
