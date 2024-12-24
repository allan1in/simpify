<template>
  <main class="app-container">
    <NavBar class="app-container__nav" />
    <section class="app-container__mid-wrapper" id="mid-wrapper">
      <MyLibrary />
      <div class="app-container__mid-wrapper__main-view">
        <MyOverlayScrollbars os-element="main" @scroll="updateBottom">
          <div class="app-container__mid-wrapper__main-view__container">
            <div class="app-container__mid-wrapper__main-view__container__content" v-show="!loading">
              <RouterView />
            </div>
            <Loading :loading="loading" />
          </div>
        </MyOverlayScrollbars>
        <Transition name="fade">
          <div v-if="resizing" class="app-container__mid-wrapper__main-view__mask"></div>
        </Transition>
      </div>
    </section>
    <PlayerBar class="app-container__player" />
  </main>
</template>

<script>
import MyLibrary from './MyLibrary/index.vue'
import NavBar from './NavBar/index.vue'
import PlayerBar from './Player/index.vue'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'
import { computed } from 'vue'
import { useLibraryStore } from '@/stores/library'

export default {
  name: 'Layout',
  data() {
    return {
      bottom: undefined
    }
  },
  components: {
    NavBar,
    MyLibrary,
    PlayerBar,
    MyOverlayScrollbars,
    Loading
  },
  computed: {
    ...mapState(useAppStore, ['loading']),
    ...mapState(useLibraryStore, ['resizing'])
  },
  provide() {
    return {
      bottom: computed(() => this.bottom)
    }
  },
  methods: {
    updateBottom(bottom) {
      this.bottom = bottom
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background-color: $color-bg-1;
  padding: $gutter;
  display: flex;
  flex-direction: column;
  gap: $gutter;

  &__mid-wrapper {
    flex-grow: 10;
    height: $height-content;
    display: flex;
    gap: $gutter;

    &__main-view {
      background-color: $color-bg-2;
      border-radius: $border-radius-default;
      flex: 4;
      height: inherit;
      overflow: hidden;
      min-width: 42rem;
      container-type: inline-size;
      container-name: container-box;
      position: relative;

      &__mask {
        background-color: rgba($color-bg-1, 0.5);
        backdrop-filter: blur(1rem);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }

      &__container {
        min-height: $height-content;

        &__content {
          max-width: $max-width-main-view;
          min-height: inherit;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
