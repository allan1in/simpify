<template>
  <main class="artist-container">
    <div class="artist-container__msg">
      <h1 class="artist-container__msg__total">{{ artists.total }} Artists</h1>
    </div>
    <div class="artist-container__results">
      <div class="artist-container__results__card" v-for="item in artists.items" :key="item.id">
        <div class="artist-container__results__card__img-wrapper">
          <img
            v-if="item.images[1]"
            :src="item.images[1].url"
            alt="Artist Cover"
            class="artist-container__results__card__img-wrapper__img"
          />
          <div v-else class="artist-container__results__card__img-wrapper__icon-wrapper">
            <IconDefaultArtist />
          </div>
        </div>
        <div class="artist-container__results__card__name-wrapper">
          <span class="artist-container__results__card__name-wrapper__name">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import IconDefaultArtist from '@/components/Icons/IconDefaultArtist.vue'
import artists from './artists.json'

export default {
  name: 'GetArtists',
  components: {
    IconDefaultArtist
  },
  data() {
    return {
      artists
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  &__msg {
    padding-bottom: 1.6rem;

    &__total {
      font-family: $font-family-title;
      font-size: 2.4rem;
    }
  }

  &__results {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    &__card {
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
          max-width: 100%;
          object-fit: contain;
        }

        &__icon-wrapper {
          width: 40%;
          aspect-ratio: 1 / 1;
          fill: $color-font-primary;
        }
      }

      &__name-wrapper {
        width: 85%;
        text-align: center;
        padding-top: 1.2rem;

        &__name {
          font-size: 1.6rem;
        }
      }
    }
  }
}
</style>
