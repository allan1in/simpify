<template>
  <div class="artist-card" @click="$router.push({ name: 'Artist', params: { artistId: item.id } })">
    <div class="artist-card__img-wrapper">
      <img
        v-if="item.images[1]"
        :src="item.images[1].url"
        alt="Artist Cover"
        class="artist-card__img-wrapper__img"
      />
      <div v-else class="artist-card__img-wrapper__icon-wrapper">
        <IconDefaultArtist />
      </div>
    </div>
    <div class="artist-card__name-wrapper">
      <router-link
        :to="{ name: 'Artist', params: { artistId: item.id } }"
        class="artist-card__name-wrapper__name"
        >{{ item.name }}</router-link
      >
      <div class="artist-card__name-wrapper__type">
        {{ `${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}` }}
      </div>
    </div>
  </div>
</template>

<script>
import IconDefaultArtist from '@/components/Icons/IconDefaultArtist.vue'

export default {
  name: 'ArtistCard',
  components: {
    IconDefaultArtist
  },
  props: {
    item: {
      type: Object,
      require: true
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-card {
  border-radius: $border-radius-default;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem 0;
  cursor: pointer;

  &:hover {
    background-color: $color-bg-3;
  }

  &__img-wrapper {
    width: 85%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-bg-6;
    box-shadow: 0 0 15px 12px rgba(0, 0, 0, 0.2);

    &__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &__icon-wrapper {
      width: 40%;
      aspect-ratio: 1 / 1;
      fill: $color-font-primary;
    }
  }

  &__name-wrapper {
    width: 85%;
    padding-top: 1.2rem;

    &__name {
      font-size: 1.6rem;

      @include oneLineEllipsis;
    }

    &__type {
      font-size: 1.4rem;
      color: $color-font-secondary;
      margin-top: 0.8rem;

      @include oneLineEllipsis;
    }
  }
}
</style>
