<template>
  <template v-if="!loading">
    <div v-bind="$attrs" class="title-show-all">
      <router-link
        v-if="routerName !== ''"
        class="title-show-all__title"
        :to="{ name: routerName }"
        >{{ title }}</router-link
      >
      <h1 v-if="routerName == ''" class="title-simple">
        {{ title }}
      </h1>
      <router-link
        v-if="routerName !== ''"
        class="title-show-all__show-all"
        :to="{ name: routerName }"
        >{{ $t('title_show_all.show_all') }}</router-link
      >
    </div>
  </template>
  <template v-else>
    <div class="title-show-all">
      <Skeleton class="title-show-all__title skeleton__title" />
      <Skeleton class="title-show-all__show-all skeleton__show-all" />
    </div>
  </template>
</template>

<script>
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'ShowAllTitle',
  inheritAttrs: false,
  components: {
    Skeleton
  },
  props: {
    routerName: {
      type: String,
      require: false,
      default: ''
    },
    title: {
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
  &__title {
    height: $font-size-title-primary;
    width: 10%;
  }

  &__show-all {
    height: $font-size-text-secondary;
    width: 5%;
  }
}

.title-show-all {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $gutter-1-5x;

  &__title {
    margin: $gutter-1-5x 0;

    @include titleStyles;
  }

  &__show-all {
    font-size: $font-size-text-secondary;
    font-weight: 700;
    font-family: $font-family-title;
  }
}

.title-simple {
  display: block;
  padding: $gutter-1-5x 0;

  @include titleStyles;
}
</style>
