<template>
  <div class="playlist-container" v-if="!loading">
    <div class="playlist-container__banner">
      <Banner :item="playlist" :images="playlist.images">
        <router-link
          class="playlist-container__banner-details__owner"
          :to="{ name: 'User', params: { userId: playlist.owner.id } }"
          >{{ playlist.owner.display_name }}</router-link
        >
        <span class="playlist-container__banner-details__release-year">
          {{
            playlist.followers.total === 0
              ? ''
              : ` • ${Intl.NumberFormat().format(playlist.followers.total)}${
                  playlist.followers.total === 1 ? ' follower' : ' followers'
                }`
          }}
        </span>
        <span
          v-if="playlist.tracks.total !== 0"
          class="playlist-container__banner-details__total-playlist.tracks"
        >
          {{ ` • ${playlist.tracks.total} songs` }}
        </span>
        <span
          v-if="playlist.tracks.total !== 0"
          class="playlist-container__banner-details__duration"
        >
          {{
            ` • ${getFormatTime(
              playlist.tracks.items.reduce((acc, item) => {
                return acc + (item.track !== null ? item.track.duration_ms : 0)
              }, 0)
            )}`
          }}
        </span>
      </Banner>
    </div>
    <div class="playlist-container__content">
      <div class="playlist-container__content__btn-group">
        <div class="playlist-container__content__btn-group__play-wrapper">
          <ButtonTogglePlay :item="playlist" />
        </div>
      </div>
      <div class="playlist-container__content__tracks">
        <TrackListHeader />
        <TrackCard
          v-for="(item, index) in playlist.tracks.items"
          :item="item.track"
          :index="index"
          :show-image="false"
          :context_uri="this.playlist.uri"
        />
      </div>
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
import Banner from '@/components/Banner/index.vue'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'

export default {
  name: 'Playlist',
  components: {
    TrackListHeader,
    TrackCard,
    Banner,
    ButtonTogglePlay
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
      const res = await getPlaylist(this.id)
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
  }
}
</script>

<style lang="scss" scoped>
.playlist-container {
  &__banner-details {
    &__owner {
      font-weight: 700;
      color: $color-font-primary;
    }
  }

  &__content {
    padding: 1.6rem;

    &__btn-group {
      padding: 0 $gutter-2x;
      padding-top: $gutter-2x;

      &__play-wrapper {
        height: 5.4rem;
        aspect-ratio: 1 / 1;
      }
    }
  }
}
</style>
