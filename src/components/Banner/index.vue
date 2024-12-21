<template>
  <template v-if="!loading">
    <div class="banner">
      <div class="banner__background" :style="backgroundStyle"></div>
      <div class="banner__img-wrapper" :class="{ 'banner__img-wrapper-round': classImgRound }">
        <Image v-if="showImg" class="banner__img-wrapper__img" :src="images[0].url" :alt="title" />
        <div v-else class="banner__img-wrapper__icon">
          <IconDefaultUser v-if="showTypeUser" />
          <IconDefaultPlaylist v-else />
        </div>
      </div>
      <div class="banner__info">
        <span class="banner__info__type">{{ type }}</span>
        <h1 v-tooltip="title" class="banner__info__title">
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
      <div class="banner__img-wrapper" :class="{ 'banner__img-wrapper-round': classImgRound }">
        <Skeleton />
      </div>
      <div class="banner__info skeleton__banner__info">
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
import IconDefaultUser from '../Icons/IconDefaultUser.vue'
import Image from '@/components/Image/index.vue'
import { getAverageColor } from '@/utils/average_color'

export default {
  name: 'Banner',
  components: {
    IconDefaultPlaylist,
    Skeleton,
    IconDefaultUser,
    Image
  },
  data() {
    return {
      color: undefined
    }
  },
  computed: {
    classImgRound() {
      return this.imgShape === 'circle'
    },
    showTypeUser() {
      return this.defaultIcon === 'user'
    },
    showImg() {
      return !!this.images?.[0]?.url
    },
    backgroundStyle() {
      return { background: this.color }
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    images: {
      type: Object,
      default: () => {
        return {}
      }
    },
    imgShape: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    defaultIcon: {
      type: String,
      default: ''
    }
  },
  watch: {
    images: {
      async handler(newVal) {
        try {
          this.color = (await getAverageColor(newVal[0].url)).rgb
        } catch (e) {}
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  &__banner__info {
    width: 100%;
  }

  &__type {
    height: $font-size-text-primary;
    width: 30%;
  }

  &__title {
    height: $font-size-title-large;
    width: 50%;
    margin: calc($font-size-title-large * 0.2) 0;
  }

  &__info {
    height: $font-size-text-primary;
    width: 40%;
  }
}

.banner {
  padding: $gutter-3x;
  background: rgba($color-bg-7, 0.6);
  display: flex;
  align-items: end;
  justify-content: start;
  gap: $gutter-3x;
  position: relative;

  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba($color-bg-2, 0.8));
    z-index: 10;
  }

  &__background {
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    @include transition;
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
    z-index: 10;

    &-round {
      border-radius: 50%;
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
    z-index: 10;

    &__type {
      font-size: $font-size-text-secondary;
    }

    &__title {
      font-family: $font-family-title;
      font-size: $font-size-title-large;
      font-weight: 800;
      margin: $gutter 0;

      @include oneLineEllipsis;

      @include respondContainer(phone) {
        font-size: calc($font-size-title-large / 2);

        @include twoLineEllipsis;
      }
    }

    &__details {
      font-size: $font-size-text-secondary;
      color: $color-font-secondary;
    }
  }
}
</style>
