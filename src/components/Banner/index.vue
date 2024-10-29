<template>
  <div class="banner">
    <div class="banner__img-wrapper" :class="{ 'banner__img-wrapper-round': imgShape === 'round' }">
      <img
        class="banner__img-wrapper__img"
        :src="item.images ? item.images[0].url : imgUrl"
        :alt="item.name ? item.name : item.display_name"
      />
    </div>
    <div class="banner__info">
      <span class="banner__info__type">{{
        `${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`
      }}</span>
      <h1 class="banner__info__title">{{ item.name ? item.name : item.display_name }}</h1>
      <div class="banner__info__details">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Banner',
  props: {
    item: {
      type: Object,
      require: true
    },
    imgUrl: {
      type: String,
      require: false,
      default: ''
    },
    imgShape: {
      type: String,
      require: false,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  padding: $gutter-4x;
  background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
  display: flex;
  align-items: end;
  justify-content: start;
  gap: $gutter-4x;

  @include respond(phone) {
    flex-direction: column;
    align-items: center;
  }

  &__img-wrapper {
    flex-shrink: 0;
    overflow: hidden;
    height: 22rem;
    width: 22rem;
    border-radius: $border-radius-default;

    &-round {
      border-radius: 50%;
    }

    @include respond(phone) {
      height: unset;
      width: 60%;
      aspect-ratio: 1 / 1;
    }

    &__img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__info {
    width: 80%;

    &__type {
      font-size: 1.4rem;
    }

    &__title {
      font-family: $font-family-title;
      font-size: 9.6rem;
      font-weight: 800;
      line-height: 1.5;

      @include oneLineEllipsis;

      @include respond(phone) {
        font-size: 3.2rem;
      }
    }

    &__details {
      font-size: 1.4rem;
      color: $color-font-secondary;
    }
  }
}
</style>
