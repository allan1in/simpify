<template>
  <div class="list-header">
    <span class="list-header__num">#</span>
    <span class="list-header__title">Title</span>
    <span class="list-header__album">Album</span>
    <span class="list-header__duration">Duration</span>
  </div>
</template>

<script>
export default {
  name: 'TrackListHeader'
}
</script>

<style lang="scss" scoped>
.list-header {
  padding: 0 2.4rem;
  display: flex;
  height: 3.6rem;
  line-height: 3.6rem;
  font-size: 1.4rem;
  color: $color-font-secondary;
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
  margin-bottom: 1.6rem;

  &__num {
    flex-basis: 3.6rem;
  }

  &__title {
    flex: 8;
  }

  &__album {
    flex: 8;
  }

  &__duration {
    flex: 1;
  }
}
</style>
