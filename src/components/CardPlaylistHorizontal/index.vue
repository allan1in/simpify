<template>
  <div
    class="card-playlist-horizontal-contanier"
    :class="{ 'card-playlist-horizontal-contanier-collasped-current': isCurrent }"
  >
    <router-link
      :to="{ name: 'Playlist', params: { playlistId: item.id } }"
      class="card-playlist-horizontal-contanier__cover"
    >
      <div class="card-playlist-horizontal-contanier__cover__icon">
        <div
          class="card-playlist-horizontal-contanier__cover__icon__wrapper"
          @click.prevent="handleClick"
        >
          <IconPause v-if="isPlaying" />
          <IconPlay v-else />
        </div>
      </div>
      <img
        class="card-playlist-horizontal-contanier__cover__img"
        :src="item.images[0]?.url"
        :alt="item.name"
      />
    </router-link>
    <div v-if="!isCollasped" class="card-playlist-horizontal-contanier__info">
      <router-link
        :to="{ name: 'Playlist', params: { playlistId: item.id } }"
        class="card-playlist-horizontal-contanier__info__name"
        :class="{
          'card-playlist-horizontal-contanier__info__name-playing': isCurrent
        }"
      >
        {{ item.name }}
      </router-link>
      <router-link
        :to="{ name: 'User', params: { userId: item.owner.id } }"
        class="card-playlist-horizontal-contanier__info__owner"
      >
        {{ item.owner.display_name }}
      </router-link>
    </div>
  </div>
</template>
<script>
import { useLibraryStore } from '@/stores/library'
import { mapActions, mapState } from 'pinia'
import IconPlay from '../Icons/IconPlay.vue'
import IconPause from '../Icons/IconPause.vue'
import { usePlayerStore } from '@/stores/player'

export default {
  name: 'CardPlaylistHorizontal',
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
    IconPlay
  },
  computed: {
    ...mapState(useLibraryStore, ['isCollasped']),
    ...mapState(usePlayerStore, ['isPause', 'context']),
    isPlaying() {
      return !this.isPause && this.context?.uri === this.item?.uri
    },
    isCurrent() {
      return this.context?.uri === this.item?.uri
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['togglePlay', 'playNewContext']),
    async handleClick() {
      if (this.item?.uri === this.context?.uri) {
        this.togglePlay()
      } else {
        this.playNewContext({ context_uri: this.item?.uri })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.card-playlist-horizontal-contanier {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 5.6rem;
  padding-left: $gutter;
  border-radius: $border-radius-small;

  @include transition;

  &:hover {
    background-color: $color-bg-5;
  }

  &:hover &__cover__icon {
    opacity: 1;
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

      @include transition;

      &__wrapper {
        height: 40%;
        aspect-ratio: 1 / 1;
        fill: $color-font-primary;

        @include clickAnimation;
      }
    }

    &__img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: space-between;

    &__name {
      font-size: $font-size-text-primary;

      &-playing {
        color: $color-brand;
      }

      @include oneLineEllipsis;
    }

    &__owner {
      font-size: $font-size-text-secondary;
      color: $color-font-secondary;

      @include oneLineEllipsis;
    }
  }
}
</style>
