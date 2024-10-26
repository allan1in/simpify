<template>
  <div class="playlist-container" v-if="!loading">
    <div class="playlist-container__cover">
      <div class="playlist-container__cover__img-wrapper">
        <img
          class="playlist-container__cover__img-wrapper__img"
          :src="playlist.images[0].url"
          :alt="playlist.owner.display_name"
        />
      </div>
      <div class="playlist-container__cover__info">
        <span class="playlist-container__cover__info__type">{{
          `${playlist.type.charAt(0).toUpperCase()}${playlist.type.slice(1)}`
        }}</span>
        <h1 class="playlist-container__cover__info__title">{{ playlist.name }}</h1>
        <div class="playlist-container__cover__info__details">
          <router-link
            class="playlist-container__cover__info__details__owner"
            :to="{ name: 'User', params: { userId: playlist.owner.id } }"
            >{{ playlist.owner.display_name }}</router-link
          >
          <span class="playlist-container__cover__info__details__release-year">
            {{
              playlist.followers.total === 0
                ? ''
                : ` • ${Intl.NumberFormat().format(playlist.followers.total)}${playlist.followers.total === 1 ? ' follower' : ' followers'}`
            }}
          </span>
          <span class="playlist-container__cover__info__details__total-playlist.tracks">
            {{ ` • ${playlist.tracks.total} songs` }}
          </span>
          <span class="playlist-container__cover__info__details__duration">
            {{
              ` • ${getFormatTime(
                playlist.tracks.items.reduce((acc, item) => {
                  return acc + (item.track !== null ? item.track.duration_ms : 0)
                }, 0)
              )}`
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="playlist-container__content">
      <TrackListHeader />
      <TrackCard
        v-for="(item, index) in playlist.tracks.items"
        :item="item.track"
        :index="index"
        :show-playlist="false"
        :show-image="false"
      />
    </div>
  </div>
</template>

<script>
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import TrackCard from '@/components/CardTrack/index.vue'
import { getPlaylist } from '@/api/meta/playlist'
import { timeFormatAlbum } from '@/utils/time_format'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Playlist',
  components: {
    TrackListHeader,
    TrackCard
  },
  data() {
    return {
      id: this.$route.params.playlistId,
      playlist: {}
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading'])
  },
  methods: {
    getFormatTime(time) {
      return timeFormatAlbum(time)
    },
    async getPlaylist() {
      const res = (await getPlaylist(this.id)).data
      this.playlist = res
      this.loading = false
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        await this.getPlaylist()
      },
      immediate: true
    }
  },
  beforeUnmount() {
    this.loading = true
  }
}
</script>

<style lang="scss" scoped>
.playlist-container {
  &__cover {
    padding: 3.2rem;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    display: flex;
    align-items: end;
    justify-content: start;
    gap: 3.2rem;

    &__img-wrapper {
      flex-shrink: 0;
      overflow: hidden;
      height: 22rem;
      width: 22rem;
      border-radius: $border-radius-default;

      &__img {
        max-height: 100%;
        object-fit: cover;
      }
    }

    &__info {
      &__type {
        font-size: 1.4rem;
      }

      &__title {
        font-family: $font-family-title;
        font-size: 9.6rem;
        font-weight: 800;

        @include oneLineEllipsis;
      }

      &__details {
        margin-top: 1rem;
        font-size: 1.4rem;
        color: $color-font-secondary;

        &__owner {
          font-weight: 700;
          color: $color-font-primary;
          vertical-align: bottom;
        }

        &__release-year {
          vertical-align: bottom;
        }

        &__total-tracks {
          vertical-align: bottom;
        }
      }
    }
  }

  &__content {
    padding: 1.6rem;
  }
}
</style>
