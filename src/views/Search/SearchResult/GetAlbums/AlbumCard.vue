<template>
  <div class="album-card">
    <div class="album-card__img-wrapper">
      <img :src="item.images[1].url" alt="Album Cover" class="album-card__img-wrapper__img" />
    </div>
    <div class="album-card__name-wrapper">
      <span class="album-card__name-wrapper__name">{{ item.name }}</span>
    </div>
    <div class="album-card__info-wrapper">
      <span class="album-card__info-wrapper__info">{{
        item.release_date.split('-')[0] +
        ' • ' +
        item.albums.reduce(
          (acc, album, index) => (index !== 0 ? acc + ', ' + album.name : item.albums[0].name),
          ''
        )
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumCard',
  props: {
    item: {
      type: Object,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
.album-card {
  border-radius: $border-radius-default;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem 0;
  cursor: pointer;

  &:hover {
    background-color: $color-bg-3;
  }

  &__img-wrapper {
    width: 85%;
    aspect-ratio: 1 / 1;
    border-radius: $border-radius-default;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-bg-6;
    box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.2);

    &__img {
      max-width: 100%;
      object-fit: contain;
    }
  }

  &__name-wrapper {
    width: 85%;
    padding-top: 1.2rem;

    &__name {
      font-size: 1.6rem;
    }
  }

  &__info-wrapper {
    width: 85%;
    padding-top: 0.3rem;

    &__info {
      font-size: 1.4rem;
      color: $color-font-secondary;
    }
  }
}
</style>
