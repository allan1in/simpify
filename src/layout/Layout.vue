<template>
  <main class="app-container">
    <NavBar />
    <section class="mid-wrapper">
      <MyLibrary />
      <div class="main-view">
        <RouterView />
      </div>
      <DetailInfo />
    </section>
    <PlayerBar />
  </main>
</template>

<script>
import DetailInfo from './components/DetailInfo.vue'
import MyLibrary from './components/MyLibrary.vue'
import NavBar from './components/NavBar.vue'
import PlayerBar from './components/PlayerBar.vue'

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
  background-color: $bg-main-color;
  height: 100vh;
  padding: $gutter;

  .mid-wrapper {
    height: calc(100vh - $nav-height - $player-height - (4 * $gutter));
    display: flex;
    gap: $gutter;

    .main-view {
      background-color: $bg-main-color-light;
      border-radius: $panel-border-radius;
      flex: 4;
    }
  }
}
</style>
