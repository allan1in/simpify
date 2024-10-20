<template>
  <div
    class="playlist-card"
    @click="$router.push({ name: 'Playlist', params: { playlistId: item.id } })"
  >
    <div class="playlist-card__img-wrapper">
      <img :src="item.images[0].url" alt="Playlist Cover" class="playlist-card__img-wrapper__img" />
    </div>
    <div class="playlist-card__name-wrapper">
      <router-link
        :to="{ name: 'Playlist', params: { playlistId: item.id } }"
        class="playlist-card__name-wrapper__name"
        >{{ item.name }}</router-link
      >
    </div>
    <div class="playlist-card__info-wrapper">
      <div class="playlist-card__info-wrapper__info">
        <span>{{ 'By ' + item.owner.display_name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardPlaylist',
  props: {
    item: {
      type: Object,
      require: true
    }
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

  &:hover {
    background-color: $color-bg-3;
  }

  &__img-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: $border-radius-default;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-bg-6;
    box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.2);

    &__img {
      height: 100%;
      width: 100%;
      object-fit: cover;
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
