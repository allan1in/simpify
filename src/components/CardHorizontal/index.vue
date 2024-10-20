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
  background-color: $color-bg-3;
  display: flex;
  justify-content: start;
  height: 6rem;
  border-radius: $border-radius-small;
  overflow: hidden;
  cursor: pointer;

  &__cover-wrapper {
    height: 100%;
    aspect-ratio: 1 / 1;

    &__cover {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__info {
    display: flex;
    align-items: center;
    padding-left: 2rem;
    font-size: 1.4rem;
    font-weight: 700;
  }

  &:hover {
    background-color: $color-bg-5;
  }
}
</style>
