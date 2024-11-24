<template>
  <template v-if="!loading">
    <div
      class="card-library-container"
      @click="$router.push({ name: 'Playlist', params: { playlistId: item.id } })"
    >
      <div class="card-library-container__cover-wrapper">
        <img
          loading="lazy"
          class="card-library-container__cover-wrapper__cover"
          :src="item.images[0].url"
          :alt="item.name"
        />
      </div>
      <div class="card-library-container__info-wrapper">
        <router-link
          :to="{ name: 'Playlist', params: { playlistId: item.id } }"
          class="card-library-container__info-wrapper__info"
          >{{ item.name }}</router-link
        >
      </div>
      <div class="card-library-container__right-wrapper">
        <div
          class="card-library-container__right-wrapper__btn-wrapper"
          :class="{
            'card-library-container__right-wrapper__btn-wrapper-playing':
              !isPause && item.uri === context.uri
          }"
        >
          <ButtonTogglePlay :item="item" />
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <Skeleton class="skeleton" />
  </template>
</template>

<script>
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import { usePlayerStore } from '@/stores/player'
import { mapState } from 'pinia'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'CardLibrary',
  props: {
    item: {
      type: Object,
      require: false,
      default: {}
    },
    loading: {
      type: Boolean,
      require: false,
      default: false
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
.skeleton {
  width: 100%;
  height: 5.6rem;
}

.card-library-container {
  display: flex;
  justify-content: start;
  width: 100%;
  height: 5.6rem;
  border-radius: $border-radius-small;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  @include transition;

  &::before {
    content: ' ';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-color: $color-bg-6;
  }

  &:hover {
    background-color: $color-bg-6;
  }

  &:hover &__right-wrapper__btn-wrapper {
    transform: translateX(-1.6rem);
    opacity: 1;
  }

  &__cover-wrapper {
    height: 100%;
    aspect-ratio: 1 / 1;
    position: relative;

    &__cover {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__info-wrapper {
    flex-grow: 1;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 2rem;
    font-size: $font-size-text-secondary;
    font-weight: 700;

    &__info {
      @include oneLineEllipsis;
    }
  }

  &__right-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    &__btn-wrapper {
      height: 60%;
      aspect-ratio: 1 / 1;
      z-index: 10;
      transform: translateX(6rem);
      opacity: 0;

      @include transition;

      &-playing {
        transform: translateX(-1.6rem);
        opacity: 1;
      }
    }
  }
}
</style>
