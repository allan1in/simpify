<template>
  <div class="playlist-card" @click="$router.push({ name: 'Playlist', params: { playlistId: item.id } })">
    <div class="playlist-card__img-box">
      <div class="playlist-card__img-box__img-wrapper">
        <img v-if="item.images?.length" :src="item.images[0].url" alt="Playlist Cover"
          class="playlist-card__img-box__img-wrapper__img" />
        <div v-else class="playlist-card__img-box__img-wrapper__icon">
          <IconDefaultPlaylist />
        </div>
      </div>
      <div class="playlist-card__img-box__toggle-play" :class="{
        'playlist-card__img-box__toggle-play-playing': !isPause && item.uri === context.uri
      }">
        <ButtonTogglePlay :item />
      </div>
    </div>

    <div class="playlist-card__name-wrapper">
      <router-link :to="{ name: 'Playlist', params: { playlistId: item.id } }"
        class="playlist-card__name-wrapper__name">{{ item.name }}</router-link>
    </div>
    <div class="playlist-card__info-wrapper">
      <div class="playlist-card__info-wrapper__info">
        <span>{{ 'By ' + item.owner.display_name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import { usePlayerStore } from '@/stores/player'
import { mapState } from 'pinia'
import IconDefaultPlaylist from '../Icons/IconDefaultPlaylist.vue'

export default {
  name: 'CardPlaylist',
  props: {
    item: {
      type: Object,
      require: true
    }
  },
  components: {
    ButtonTogglePlay,
    IconDefaultPlaylist
  },
  computed: {
    ...mapState(usePlayerStore, ['isPause', 'context'])
  }
}
</script>

<style lang="scss" scoped>
.playlist-card {
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

      &__icon {
        height: 30%;
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
      font-size: 1.6rem;

      @include twoLineEllipsis;
    }
  }

  &__info-wrapper {
    width: 100%;

    &__info {
      font-size: 1.4rem;
      color: $color-font-secondary;

      @include twoLineEllipsis;
    }
  }
}
</style>
