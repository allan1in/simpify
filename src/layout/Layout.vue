<template>
  <main class="app-container">
    <NavBar />
    <section class="mid-wrapper">
      <MyLibrary />
      <MainView />
      <DetailInfo />
    </section>
    <PlayerBar />
  </main>
</template>

<script>
import DetailInfo from './components/DetailInfo.vue'
import MainView from './components/MainView.vue'
import MyLibrary from './components/MyLibrary.vue'
import NavBar from './components/NavBar.vue'
import PlayerBar from './components/PlayerBar.vue'

export default {
  name: 'Layout',
  components: {
    NavBar,
    MyLibrary,
    MainView,
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
  }
}
</style>
