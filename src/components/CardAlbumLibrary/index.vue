<template>
  <template v-if="!loading">
    <div
      class="card-album-library-contanier"
      :class="{ 'card-album-library-contanier-collasped-current': isCurrent }"
    >
      <router-link
        :to="{ name: 'Album', params: { albumId: item.id } }"
        class="card-album-library-contanier__cover"
      >
        <div class="card-album-library-contanier__cover__icon">
          <div
            class="card-album-library-contanier__cover__icon__wrapper"
            @click.prevent="handleClick"
          >
            <IconPause v-if="isPlaying" />
            <IconPlay v-else />
          </div>
        </div>
        <div v-if="isPlaying" class="card-album-library-contanier__cover__playing">
          <img
            class="card-album-library-contanier__cover__playing__img"
            loading="lazy"
            src="/src/assets/images/playing.gif"
            alt=""
          />
        </div>
        <img
          class="card-album-library-contanier__cover__img"
          :src="item.images[0]?.url"
          :alt="item.name"
        />
      </router-link>
      <div v-if="!isCollasped" class="card-album-library-contanier__info">
        <router-link
          :to="{ name: 'Album', params: { albumId: item.id } }"
          class="card-album-library-contanier__info__title"
          :class="{
            'card-album-library-contanier__info__title-playing': isCurrent
          }"
        >
          {{ item.name }}
        </router-link>
        <div class="card-album-library-contanier__info__artists">
          <span
            v-for="(artist, index) in item.artists"
            class="card-album-library-contanier__info__artists__item"
          >
            {{ index === 0 ? '' : ', ' }}
            <router-link
              :to="{ name: 'Artist', params: { artistId: artist.id } }"
              class="card-album-library-contanier__info__artists__item__link"
            >
              {{ artist.name }}
            </router-link>
          </span>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="card-album-library-contanier skeleton">
      <div class="card-album-library-contanier__cover">
        <Skeleton class="card-album-library-contanier__cover__img" />
      </div>
      <div v-if="!isCollasped" class="card-album-library-contanier__info">
        <Skeleton class="card-album-library-contanier__info__title skeleton__name" />
        <Skeleton class="card-album-library-contanier__info__artists skeleton__artists" />
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
  name: 'CardAlbumLibrary',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: {}
    }
  },
  components: {
    IconPause,
    IconPlay,
    Skeleton
  },
  computed: {
    ...mapState(useLibraryStore, ['isCollasped']),
    ...mapState(usePlayerStore, ['isPause', 'context']),
    isPlaying() {
      return !this.isPause && this.isCurrent
    },
    isCurrent() {
      return this.context?.uri === this.item.uri
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['togglePlay', 'playNewContext']),
    async handleClick() {
      if (this.isCurrent) {
        await this.togglePlay()
      } else {
        // New context
        let data = null
        data = {
          context_uri: this.item.uri
        }
        await this.playNewContext(data)
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

.card-album-library-contanier {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 5.6rem;
  padding-left: $gutter;
  border-radius: $border-radius-small;

  @include transition;

  &:hover {
    background-color: $color-bg-3;
  }

  &:hover &__cover__icon {
    opacity: 1;
  }

  &:hover &__cover__playing {
    opacity: 0;
  }

  &-collasped-current {
    background-color: $color-bg-5;
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
    flex: 1;
    height: 70%;
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
