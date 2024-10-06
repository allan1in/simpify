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
import DetailInfo from '../components/DetailInfo/index.vue'
import MyLibrary from '../components/MyLibrary/index.vue'
import NavBar from '../components/NavBar/index.vue'
import PlayerBar from '../components/Player/index.vue'

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
    height: calc(100vh - $height-nav - $height-player - (4 * $gutter));
    display: flex;
    gap: $gutter;

    .main-view {
      background-color: $color-bg-2;
      border-radius: $border-radius;
      flex: 4;
      height: inherit;
      overflow: hidden;
    }
  }
}
</style>
