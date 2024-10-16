<template>
  <section class="top-bar-container">
    <button
      v-if="showTags.track || showTags.artist || showTags.album"
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === $route.params.inputContent }"
      @click="getAll"
    >
      All
    </button>
    <button
      v-if="showTags.track"
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === 'tracks' }"
      @click="getSongs"
    >
      Songs
    </button>
    <button
      v-if="showTags.artist"
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === 'artists' }"
      @click="getArtists"
    >
      Artists
    </button>
    <button
      v-if="showTags.album"
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === 'albums' }"
      @click="getAlbums"
    >
      Albums
    </button>
    <button
      v-if="showTags.playlist"
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === 'playlists' }"
      @click="getPlaylists"
    >
      Playlists
    </button>
  </section>
</template>

<script>
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
    },
    getPlaylists() {
      this.$router.push({ name: 'GetPlaylists' })
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
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1.2rem;
  padding: 1.2rem 0;
  padding-left: 2.4rem;
  background-color: $color-bg-2;
  border-top-left-radius: $gutter;
  border-top-right-radius: $gutter;
  height: $height-nav-secondary;

  &__btn {
    background-color: $color-bg-5;
    color: $color-font-primary;
    padding: 0.4rem 1.2rem;
    height: 100%;
    border-radius: 3.2rem;

    &:hover {
      background-color: $color-bg-6;
    }
  }
}
</style>
