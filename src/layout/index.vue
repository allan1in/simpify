<template>
  <main class="app-container">
    <NavBar />
    <section class="mid-wrapper">
      <!-- <MyLibrary /> -->
      <div class="main-view">
        <RouterView />
      </div>
      <!-- <DetailInfo /> -->
    </section>
    <PlayerBar />
  </main>
</template>

<script>
import DetailInfo from './DetailInfo/index.vue'
import MyLibrary from './MyLibrary/index.vue'
import NavBar from './NavBar/index.vue'
import PlayerBar from './Player/index.vue'

export default {
  name: 'Layout',
  components: {
    NavBar,
    MyLibrary,
    DetailInfo,
    PlayerBar
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background-color: $color-bg-1;
  height: 100vh;
  padding: $gutter;

  .mid-wrapper {
    height: $height-content;
    display: flex;
    gap: $gutter;

    .main-view {
      background-color: $color-bg-2;
      border-radius: $border-radius-default;
      flex: 4;
      height: inherit;
      overflow: hidden;
    }
  }
}
</style>
