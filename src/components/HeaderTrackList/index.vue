<template>
  <template v-if="!loading">
    <div class="list-header">
      <div class="list-header__num-wrapper">
        <div class="list-header__num-wrapper__num">#</div>
      </div>
      <div class="list-header__title">Title</div>
      <div v-if="showAlbum" class="list-header__album">Album</div>
      <div class="list-header__duration">Duration</div>
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
      <div class="list-header__album">
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
      require: false,
      default: true
    },
    loading: {
      type: Boolean,
      require: false,
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
  margin: 1.6rem;
  padding: 0 2.4rem;
  display: flex;
  height: 3.6rem;
  line-height: 3.6rem;
  font-size: $font-size-text-secondary;
  color: $color-font-secondary;
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);

  @include respond(phone) {
    display: none;
  }

  &__num-wrapper {
    flex-basis: 3.6rem;
    position: relative;

    &__num {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 2.4rem;
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
