<template>
  <div class="album-card" @click="$router.push({ name: 'Album', params: { albumId: item.id } })">
    <div class="album-card__img-wrapper">
      <img :src="item.images[0].url" alt="Album Cover" class="album-card__img-wrapper__img" />
    </div>
    <div class="album-card__name-wrapper">
      <router-link
        :to="{ name: 'Album', params: { albumId: item.id } }"
        class="album-card__name-wrapper__name"
        >{{ item.name }}</router-link
      >
    </div>
    <div class="album-card__info-wrapper">
      <div class="album-card__info-wrapper__info">
        <span>{{ item.release_date.split('-')[0] }}</span>
        <span v-if="showAlbumType">{{
          ` • ${item.album_type.charAt(0).toUpperCase()}${item.album_type.slice(1)}`
        }}</span>

        <span v-if="showArtists">
          <span> • </span>
          <!-- Use native a tag because router-link tag can't handle event bubbling easily -->
          <a
            @click.stop="$router.push({ name: 'Artist', params: { artistId: artist.id } })"
            v-for="(artist, index) in item.artists"
          >
            {{ (index === 0 ? '' : ', ') + artist.name }}
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardAlbum',
  props: {
    item: {
      type: Object,
      require: true
    },
    showArtists: {
      type: Boolean,
      require: false,
      default: true
    },
    showAlbumType: {
      type: Boolean,
      require: false,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.album-card {
  border-radius: $border-radius-default;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem;
  cursor: pointer;

  &:hover {
    background-color: $color-bg-3;
  }

  &__img-wrapper {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: $border-radius-default;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-bg-6;
    box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.2);

    &__img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__name-wrapper {
    width: 100%;
    padding-top: 1.2rem;

    &__name {
      font-size: 1.6rem;

      @include twoLineEllipsis;
    }
  }

  &__info-wrapper {
    width: 100%;

    &__info {
      font-size: 1.4rem;
      color: $color-font-secondary;

      @include twoLineEllipsis;
    }
  }
}
</style>
