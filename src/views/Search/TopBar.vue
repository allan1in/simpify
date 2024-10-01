<template>
  <section class="top-bar-container">
    <button
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === $route.params.content }"
      @click="getAll"
    >
      All
    </button>
    <button
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === 'artists' }"
      @click="getArtists"
    >
      Artists
    </button>
    <button
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === 'tracks' }"
      @click="getSongs"
    >
      Songs
    </button>
    <button
      class="top-bar-container__btn"
      :class="{ 'btn-active': isActive === 'albums' }"
      @click="getAlbums"
    >
      Albums
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
  methods: {
    getAll() {
      this.$router.push({ name: 'GetAll' })
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
        this.isActive = to.path.substr(to.path.lastIndexOf('/') + 1)
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
  padding: 1.2rem 0;
  background-color: $color-font-secondary;
  border-top-left-radius: $gutter;
  border-top-right-radius: $gutter;

  &__btn {
    background-color: $color-bg-5;
    color: $color-font-primary;
    padding: 0.4rem 1.2rem;
    height: 3.2rem;
    border-radius: 3.2rem;
    margin-left: 1.2rem;

    &:nth-child(1) {
      margin-left: 2.4rem;
    }

    &:hover {
      background-color: $color-bg-6;
    }
  }
}
</style>
