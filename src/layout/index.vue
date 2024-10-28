<template>
  <main class="app-container">
    <NavBar class="app-container__nav" />
    <section class="app-container__mid-wrapper">
      <!-- <MyLibrary /> -->
      <div class="app-container__mid-wrapper__main-view">
        <Container>
          <RouterView />
        </Container>
      </div>
      <!-- <DetailInfo /> -->
    </section>
    <PlayerBar class="app-container__player" />
  </main>
</template>

<script>
import DetailInfo from './DetailInfo/index.vue'
import MyLibrary from './MyLibrary/index.vue'
import NavBar from './NavBar/index.vue'
import PlayerBar from './Player/index.vue'
import Container from '@/components/Container/index.vue'

export default {
  name: 'Layout',
  components: {
    NavBar,
    MyLibrary,
    DetailInfo,
    PlayerBar,
    Container
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background-color: $color-bg-1;
  height: 100vh;
  padding: $gutter;

  &__mid-wrapper {
    height: $height-content;
    display: flex;
    gap: $gutter;

    &__main-view {
      background-color: $color-bg-2;
      border-radius: $border-radius-default;
      flex: 4;
      height: inherit;
      overflow: hidden;
    }
  }
}
</style>
