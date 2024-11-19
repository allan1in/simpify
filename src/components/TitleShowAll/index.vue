<template>
  <template v-if="!loading">
    <div class="title-show-all" v-if="routerName !== ''">
      <router-link class="title-show-all__title" :to="{ name: routerName }">{{
        title
      }}</router-link>
      <router-link class="title-show-all__show-all" :to="{ name: routerName }">{{ $t('title_show_all.show_all')
        }}</router-link>
    </div>
    <h1 v-else class="title-simple">
      {{ title }}
    </h1>
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
  padding: $gutter-1-5x;

  @include titleStyles;
}
</style>
