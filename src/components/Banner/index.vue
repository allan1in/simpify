<template>
  <template v-if="!loading">
    <div class="banner">
      <div
        class="banner__img-wrapper"
        :class="{ 'banner__img-wrapper-round': imgShape === 'circle' }"
      >
        <img
          v-if="images !== null && images.length !== 0"
          class="banner__img-wrapper__img"
          :src="images[0].url"
          :alt="title"
        />
        <div v-else class="banner__img-wrapper__icon">
          <IconDefaultPlaylist />
        </div>
      </div>
      <div class="banner__info">
        <span class="banner__info__type">{{ type }}</span>
        <h1 class="banner__info__title" :title="title">
          {{ title }}
        </h1>
        <div class="banner__info__details">
          <slot></slot>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="banner">
      <div
        class="banner__img-wrapper"
        :class="{ 'banner__img-wrapper-round': imgShape === 'circle' }"
      >
        <Skeleton />
      </div>
      <div class="banner__info">
        <Skeleton class="skeleton__type" />
        <Skeleton class="skeleton__title" />
        <Skeleton class="skeleton__info" />
      </div>
    </div>
  </template>
</template>

<script>
import IconDefaultPlaylist from '../Icons/IconDefaultPlaylist.vue'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'Banner',
  components: {
    IconDefaultPlaylist,
    Skeleton
  },
  props: {
    type: {
      type: String,
      require: false,
      default: ''
    },
    title: {
      type: String,
      require: false,
      default: ''
    },
    images: {
      type: Object,
      require: false,
      default: {}
    },
    imgShape: {
      type: String,
      require: false,
      default: ''
    },
    loading: {
      type: Boolean,
      require: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  &__type {
    height: $font-size-text-primary;
    width: 10%;
  }

  &__title {
    height: $font-size-title-large;
    width: 50%;
    margin: calc($font-size-title-large * 0.2) 0;
  }

  &__info {
    height: $font-size-text-primary;
    width: 30%;
  }
}
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
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $color-bg-3;
    box-shadow: 0 0 20px 20px rgba($color-bg-3, 0.2);

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

    &__icon {
      height: 30%;
      aspect-ratio: 1 / 1;
      fill: $color-bg-7;
    }
  }

  &__info {
    width: 80%;

    &__type {
      font-size: $font-size-text-secondary;
    }

    &__title {
      font-family: $font-family-title;
      font-size: $font-size-title-large;
      font-weight: 800;
      line-height: 1.5;

      @include oneLineEllipsis;

      @include respond(phone) {
        font-size: 3.2rem;
      }
    }

    &__details {
      font-size: $font-size-text-secondary;
      color: $color-font-secondary;
    }
  }
}
</style>
