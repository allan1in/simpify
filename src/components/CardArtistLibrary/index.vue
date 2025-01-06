<template>
  <template v-if="!loading">
    <div
      class="card-artist-library-contanier"
      :class="{ 'card-artist-library-contanier-collasped-current': isCurrentPage }"
      @click="$router.push({ name: 'Artist', params: { artistId: item.id } })"
    >
      <div class="card-artist-library-contanier__cover">
        <div class="card-artist-library-contanier__cover__icon">
          <button
            v-tooltip="toolTipPlay"
            @click.prevent.stop="handleClick"
            class="card-artist-library-contanier__cover__icon__wrapper"
          >
            <IconPause v-if="isPlaying" />
            <IconPlay v-else />
          </button>
        </div>

        <div v-if="isPlaying" class="card-artist-library-contanier__cover__playing">
          <i class="card-artist-library-contanier__cover__playing__icon"></i>
        </div>
        <Image
          class="card-artist-library-contanier__cover__img"
          :src="item.images[0]?.url"
          :alt="item.name"
          no-scale
        />
      </div>
      <Transition name="fade">
        <div v-if="!active_collasped" class="card-artist-library-contanier__info">
          <a
            @click.prevent.stop="$router.push({ name: 'Artist', params: { artistId: item.id } })"
            class="card-artist-library-contanier__info__title"
            :class="{
              'card-artist-library-contanier__info__title-playing': isCurrentItem
            }"
          >
            {{ item.name }}
          </a>
        </div>
      </Transition>
    </div>
  </template>
  <template v-else>
    <div class="card-artist-library-contanier skeleton">
      <div class="card-artist-library-contanier__cover">
        <Skeleton class="card-artist-library-contanier__cover__img" />
      </div>
      <div v-if="!active_collasped" class="card-artist-library-contanier__info">
        <Skeleton class="card-artist-library-contanier__info__title skeleton__name" />
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
import Image from '@/components/Image/index.vue'

export default {
  name: 'CardArtistLibrary',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    IconPause,
    IconPlay,
    Skeleton,
    Image
  },
  computed: {
    ...mapState(useLibraryStore, ['active_collasped']),
    ...mapState(usePlayerStore, ['isPause', 'context']),
    isPlaying() {
      return !this.isPause && this.isCurrentItem
    },
    isCurrentItem() {
      return this.context?.uri === this.item.uri
    },
    isCurrentPage() {
      return (
        this.$route.fullPath
          .split('/')
          .map((item) => this.item.id === item)
          .indexOf(true) !== -1
      )
    },
    toolTipPlay() {
      if (this.isPlaying) {
        return this.$t('tooltip.pause_item', { item: this.item.name })
      }
      return this.$t('tooltip.play_item', { item: this.item.name })
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['togglePlay', 'playNewContext']),
    async handleClick() {
      if (this.isCurrentItem) {
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
}

.card-artist-library-contanier {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $gutter;
  height: 5.6rem;
  padding: 0 $gutter;
  border-radius: $border-radius-small;
  cursor: pointer;

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
    background-color: $color-bg-4;

    &:hover {
      background-color: $color-bg-5;
    }
  }

  &__cover {
    flex-shrink: 0;
    display: block;
    height: 70%;
    aspect-ratio: 1 / 1;
    position: relative;
    overflow: hidden;
    border-radius: 50%;

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
        display: block;
        height: 1.8rem;
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

      &__icon {
        display: block;
        background: url(/src/assets/images/playing.gif);
        background-size: cover;
        height: 30%;
        aspect-ratio: 1 / 1;
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
    align-items: center;

    &__title {
      font-size: $font-size-text-primary;

      &-playing {
        color: $color-brand;
      }

      @include oneLineEllipsis;
    }
  }
}
</style>
