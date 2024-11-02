<template>
  <div
    class="card-horizontal-container"
    @click="$router.push({ name: 'Track', params: { trackId: item.id } })"
  >
    <div class="card-horizontal-container__cover-wrapper">
      <img
        class="card-horizontal-container__cover-wrapper__cover"
        :src="item.images[0].url"
        :alt="item.name"
      />
    </div>
    <div class="card-horizontal-container__info-wrapper">
      <router-link
        :to="{ name: 'Playlist', params: { playlistId: item.id } }"
        class="card-horizontal-container__info-wrapper__info"
        >{{ item.name }}</router-link
      >
    </div>
    <div class="card-horizontal-container__right-wrapper">
      <div
        class="card-horizontal-container__right-wrapper__btn-wrapper"
        :class="{
          'card-horizontal-container__right-wrapper__btn-wrapper-playing':
            !isPause && item.uri === context.uri
        }"
      >
        <ButtonTogglePlay :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import { usePlayerStore } from '@/stores/player'
import { mapState } from 'pinia'

export default {
  name: 'CardHorizontal',
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  components: {
    ButtonTogglePlay
  },
  computed: {
    ...mapState(usePlayerStore, ['isPause', 'context'])
  }
}
</script>

<style lang="scss" scoped>
.card-horizontal-container {
  display: flex;
  justify-content: start;
  width: 100%;
  aspect-ratio: 6 / 1;
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
    transform: translateX(0);
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
    font-size: 1.4rem;
    font-weight: 700;

    &__info {
      @include oneLineEllipsis;
    }
  }

  &__right-wrapper {
    justify-self: end;
    display: flex;
    justify-content: center;
    align-items: center;

    &__btn-wrapper {
      height: 60%;
      aspect-ratio: 1 / 1;
      margin: 0 1.6rem;
      z-index: 10;
      transform: translateX(6rem);
      opacity: 0;

      @include transition;

      &-playing {
        transform: translateX(0);
        opacity: 1;
      }
    }
  }
}
</style>
