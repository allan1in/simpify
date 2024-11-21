<template>
  <template v-if="!loading">
    <div class="list-header">
      <div v-if="showNumber" class="list-header__num-wrapper">
        <div class="list-header__num-wrapper__num">#</div>
      </div>
      <div class="list-header__title">{{ $t('header_track_list.title') }}</div>
      <div v-if="showAlbum" class="list-header__album">{{ $t('header_track_list.album') }}</div>
      <div class="list-header__duration">{{ $t('header_track_list.duration') }}</div>
    </div>
  </template>
  <template v-else>
    <div class="list-header">
      <div class="list-header__num-wrapper">
        <div class="list-header__num-wrapper__num">
          <Skeleton class="skeleton__name" />
        </div>
      </div>
      <div class="list-header__title">
        <Skeleton class="skeleton__title" />
      </div>
      <div class="list-header__album" v-if="showAlbum">
        <Skeleton class="skeleton__album" />
      </div>
      <div class="list-header__duration">
        <Skeleton class="skeleton__duration" />
      </div>
    </div>
  </template>
</template>

<script>
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'HeaderTrackList',
  props: {
    showAlbum: {
      type: Boolean,
      default: true
    },
    showNumber: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Skeleton
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  &__name {
    height: $font-size-text-secondary;
    width: 1.6rem;
  }

  &__title {
    height: $font-size-text-secondary;
    width: 20%;
  }

  &__album {
    height: $font-size-text-secondary;
    width: 20%;
  }

  &__duration {
    height: $font-size-text-secondary;
    width: 90%;
  }
}

.list-header {
  padding-left: 0.6rem;
  margin-bottom: $gutter-1-5x;
  display: flex;
  height: 3.6rem;
  line-height: 3.6rem;
  font-size: $font-size-text-secondary;
  color: $color-font-secondary;
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
  background-color: $color-bg-2;

  @include respondContainer(phone) {
    display: none;
  }

  &__num-wrapper {
    flex-basis: 5.6rem;
    position: relative;

    &__num {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 2.8rem;
    }
  }

  &__title,
  &__album {
    flex: 1;
    display: flex;
    align-items: center;
  }

  &__duration {
    flex-basis: 7.2rem;
    display: flex;
    align-items: center;
  }
}
</style>
