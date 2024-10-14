<template>
  <KeepAlive>
    <section class="top-bar-container">
      <div
        class="top-bar-container__btn-wrapper"
        v-if="!checkLoading && (showTracks || showArtists || showAlbums)"
      >
        <button
          class="top-bar-container__btn-wrapper__btn"
          :class="{ 'btn-active': isActive === $route.params.inputContent }"
          @click="getAll"
        >
          All
        </button>
        <button
          v-if="showTracks"
          class="top-bar-container__btn-wrapper__btn"
          :class="{ 'btn-active': isActive === 'tracks' }"
          @click="getSongs"
        >
          Songs
        </button>
        <button
          v-if="showArtists"
          class="top-bar-container__btn-wrapper__btn"
          :class="{ 'btn-active': isActive === 'artists' }"
          @click="getArtists"
        >
          Artists
        </button>
        <button
          v-if="showAlbums"
          class="top-bar-container__btn-wrapper__btn"
          :class="{ 'btn-active': isActive === 'albums' }"
          @click="getAlbums"
        >
          Albums
        </button>
      </div>
    </section>
  </KeepAlive>
</template>

<script>
import { mapWritableState } from 'pinia'
import { useSearchStore } from '@/stores/search'

export default {
  name: 'TopBar',
  data() {
    return {
      isActive: ''
    }
  },
  props: {
    showTags: {
      type: Object,
      require: true
    }
  },
  computed: {
    ...mapWritableState(useSearchStore, ['showAlbums', 'showArtists', 'showTracks', 'checkLoading'])
  },
  methods: {
    getAll() {
      this.$router.push({ name: 'SearchResult' })
    },
    getArtists() {
      this.$router.push({ name: 'GetArtists' })
    },
    getSongs() {
      this.$router.push({ name: 'GetTracks' })
    },
    getAlbums() {
      this.$router.push({ name: 'GetAlbums' })
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        this.isActive = decodeURIComponent(to.path.substr(to.path.lastIndexOf('/') + 1))
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-active:nth-child(n) {
  background-color: $color-font-primary;
  color: $color-bg-1;

  &:hover {
    background-color: $color-font-primary;
  }
}

.top-bar-container {
  position: sticky;
  top: 0;
  height: 6rem;
  padding: 1.2rem 0;
  padding-left: 2.4rem;
  background-color: $color-bg-2;
  border-top-left-radius: $gutter;
  border-top-right-radius: $gutter;

  &__btn-wrapper {
    display: flex;
    gap: 1.2rem;
    justify-content: start;
    align-items: center;
    height: 100%;

    &__btn {
      background-color: $color-bg-5;
      color: $color-font-primary;
      padding: 0.4rem 1.2rem;
      height: 90%;
      border-radius: 3.2rem;

      &:hover {
        background-color: $color-bg-6;
      }
    }
  }
}
</style>
