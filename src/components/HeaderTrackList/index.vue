<template>
  <div class="list-header">
    <div class="list-header__num-wrapper"><span class="list-header__num-wrapper__num">#</span></div>
    <span class="list-header__title">Title</span>
    <span v-if="showAlbum" class="list-header__album">Album</span>
    <span class="list-header__duration">Duration</span>
  </div>
</template>

<script>
export default {
  name: 'HeaderTrackList',
  props: {
    showAlbum: {
      type: Boolean,
      require: false,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.list-header {
  margin: 1.6rem;
  padding: 0 2.4rem;
  display: flex;
  height: 3.6rem;
  line-height: 3.6rem;
  font-size: 1.4rem;
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

  &__title {
    flex: 8;
  }

  &__album {
    flex: 8;
  }

  &__duration {
    flex-basis: 7.2rem;
  }
}
</style>
