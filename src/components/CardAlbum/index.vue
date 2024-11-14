<template>
  <template v-if="!loading">
    <div class="album-card" @click="$router.push({ name: 'Album', params: { albumId: item.id } })">
      <div class="album-card__img-box">
        <div class="album-card__img-box__img-wrapper">
          <img
            loading="lazy"
            :src="item.images[0].url"
            alt="Album Cover"
            class="album-card__img-box__img-wrapper__img"
          />
        </div>
        <div class="album-card__img-box__toggle-play">
          <ButtonTogglePlay :item />
        </div>
      </div>

      <div class="album-card__name-wrapper">
        <router-link
          :to="{ name: 'Album', params: { albumId: item.id } }"
          class="album-card__name-wrapper__name"
          >{{ item.name }}</router-link
        >
      </div>
      <div class="album-card__info-wrapper">
        <div class="album-card__info-wrapper__info">
          <span>{{ item.release_date.split('-')[0] }}</span>
          <span v-if="showArtists">
            <span> • </span>
            <!-- Use native tag a because router-link tag can't handle event bubbling easily -->
            <a
              @click.stop="$router.push({ name: 'Artist', params: { artistId: artist.id } })"
              v-for="(artist, index) in item.artists"
              :key="artist.id"
            >
              {{ (index === 0 ? '' : ', ') + artist.name }}
            </a>
          </span>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="album-card no-hover">
      <div class="album-card__img-box">
        <div class="album-card__img-box__img-wrapper">
          <Skeleton />
        </div>
      </div>
      <div class="album-card__name-wrapper">
        <Skeleton class="skeleton__name" />
      </div>
      <div class="album-card__info-wrapper">
        <div class="album-card__info-wrapper__info">
          <Skeleton class="skeleton__info" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import { usePlayerStore } from '@/stores/player'
import { mapState } from 'pinia'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'CardAlbum',
  props: {
    item: {
      type: Object,
      require: true
    },
    showArtists: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean
    }
  },
  components: {
    ButtonTogglePlay,
    Skeleton
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
    width: 100%;
  }

  &__info {
    height: $font-size-text-secondary;
    width: 80%;
    margin-top: calc($font-size-text-secondary * 0.5);
  }
}

.album-card {
  border-radius: $border-radius-default;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem;
  cursor: pointer;

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
      border-radius: $border-radius-default;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $color-bg-3;
      box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.2);

      &__img {
        height: 100%;
        width: 100%;
        object-fit: cover;
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
    }
  }

  &__name-wrapper {
    width: 100%;
    padding-top: 1.2rem;

    &__name {
      font-size: $font-size-text-primary;

      @include twoLineEllipsis;
    }
  }

  &__info-wrapper {
    width: 100%;

    &__info {
      font-size: $font-size-text-secondary;
      color: $color-font-secondary;

      @include twoLineEllipsis;
    }
  }
}
</style>
