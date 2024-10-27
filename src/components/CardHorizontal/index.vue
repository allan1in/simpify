<template>
  <div
    class="card-horizontal-container"
    @click="$router.push({ name: 'Track', params: { trackId: item.id } })"
  >
    <div class="card-horizontal-container__cover-wrapper">
      <img
        class="card-horizontal-container__cover-wrapper__cover"
        :src="item.album.images[0].url"
        :alt="item.name"
      />
    </div>
    <div class="card-horizontal-container__info">
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardHorizontal',
  props: {
    item: {
      type: Object,
      require: true
    }
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
    opacity: 0.2;
    background-color: $color-bg-6;
  }

  &:hover {
    background-color: $color-bg-6;
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

  &__info {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 2rem;
    font-size: 1.4rem;
    font-weight: 700;
  }
}
</style>
