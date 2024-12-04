<template>
  <template v-if="!loading">
    <div
      class="card-track-library-contanier"
      :class="{ 'card-track-library-contanier-collasped-current': isCurrentPage }"
      @click="$router.push({ name: 'Track', params: { trackId: item.id } })"
    >
      <div class="card-track-library-contanier__cover">
        <div class="card-track-library-contanier__cover__icon">
          <div
            class="card-track-library-contanier__cover__icon__wrapper"
            @click.prevent.stop="handleClick"
          >
            <IconPause v-if="isPlaying" />
            <IconPlay v-else />
          </div>
        </div>
        <div v-if="isPlaying" class="card-track-library-contanier__cover__playing">
          <img
            class="card-track-library-contanier__cover__playing__img"
            loading="lazy"
            src="/src/assets/images/playing.gif"
            alt=""
          />
        </div>
        <img
          class="card-track-library-contanier__cover__img"
          :src="item.album.images[0]?.url"
          :alt="item.name"
        />
      </div>
      <div v-if="!isCollasped" class="card-track-library-contanier__info">
        <router-link
          :to="{ name: 'Track', params: { trackId: item.id } }"
          class="card-track-library-contanier__info__title"
          :class="{
            'card-track-library-contanier__info__title-playing': isCurrentItem
          }"
        >
          {{ item.name }}
        </router-link>
        <div class="card-track-library-contanier__info__artists">
          <span
            v-for="(artist, index) in item.artists"
            class="card-track-library-contanier__info__artists__item"
          >
            {{ index === 0 ? '' : ', ' }}
            <router-link
              :to="{ name: 'Artist', params: { artistId: artist.id } }"
              class="card-track-library-contanier__info__artists__item__link"
            >
              {{ artist.name }}
            </router-link>
          </span>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="card-track-library-contanier skeleton">
      <div class="card-track-library-contanier__cover">
        <Skeleton class="card-track-library-contanier__cover__img" />
      </div>
      <div v-if="!isCollasped" class="card-track-library-contanier__info">
        <Skeleton class="card-track-library-contanier__info__title skeleton__name" />
        <Skeleton class="card-track-library-contanier__info__artists skeleton__artists" />
      </div>
    </div>
  </template>
</template>
<script>
import { useLibraryStore } from '@/stores/library'
import { mapActions, mapState } from 'pinia'
import IconPlay from '../Icons/IconPlay.vue'
import IconPause from '../Icons/IconPause.vue'
import { usePlayerStore } from '@/stores/player'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'CardTrackLibrary',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: {}
    },
    index: {
      type: Number,
      default: 0
    },
    uris: {
      type: Array,
      default: []
    }
  },
  components: {
    IconPause,
    IconPlay,
    Skeleton
  },
  computed: {
    ...mapState(useLibraryStore, ['isCollasped']),
    ...mapState(usePlayerStore, ['isPause', 'current_track']),
    isPlaying() {
      return !this.isPause && this.isCurrentItem
    },
    isCurrentItem() {
      return this.current_track?.uri === this.item.uri
    },
    isCurrentPage() {
      return (
        this.$route.fullPath
          .split('/')
          .map((item) => this.item.id === item)
          .indexOf(true) !== -1
      )
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['togglePlay', 'playNewTrack']),
    async handleClick() {
      if (this.isCurrentItem) {
        await this.togglePlay()
      } else {
        // New track
        let data

        data = {
          uris: this.uris,
          offset: { position: this.index }
        }

        await this.playNewTrack(data, this.item)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.skeleton {
  &:nth-child(n):hover {
    background-color: unset;
  }

  &__name {
    height: $font-size-text-primary;
    width: 50%;
  }

  &__artists {
    height: $font-size-text-secondary;
    width: 80%;
  }
}

.card-track-library-contanier {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 5.6rem;
  padding-left: $gutter;
  border-radius: $border-radius-small;
  cursor: pointer;

  @include transition;

  &:hover {
    background-color: $color-bg-4;
  }

  &:hover &__cover__icon {
    opacity: 1;
  }

  &:hover &__cover__playing {
    opacity: 0;
  }

  &-collasped-current {
    background-color: $color-bg-6;
  }

  &__cover {
    flex-shrink: 0;
    display: block;
    height: 70%;
    aspect-ratio: 1 / 1;
    margin-right: $gutter;
    position: relative;
    overflow: hidden;
    border-radius: $border-radius-small;

    &__icon {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color-bg-1, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      z-index: 1;

      @include transition;

      &__wrapper {
        height: 40%;
        aspect-ratio: 1 / 1;
        fill: $color-font-primary;

        @include clickAnimation;
      }
    }

    &__playing {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color-bg-1, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;

      @include transition;

      &__img {
        height: 30%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
      }
    }

    &__img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__info {
    height: 70%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;

    &__title {
      font-size: $font-size-text-primary;

      &-playing {
        color: $color-brand;
      }

      @include oneLineEllipsis;
    }

    &__artists {
      @include oneLineEllipsis;

      &__item {
        font-size: $font-size-text-secondary;
        color: $color-font-secondary;
      }
    }
  }
}
</style>
