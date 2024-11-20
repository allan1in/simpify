<template>
  <template v-if="!loading_skeleton">
    <div class="playlist-container">
      <div class="playlist-container__banner">
        <Banner :type="$t('playlist.type')" :title="playlist.name" :images="playlist.images">
          <router-link class="playlist-container__banner-details__owner"
            :to="{ name: 'User', params: { userId: playlist.owner.id } }">{{ playlist.owner.display_name
            }}</router-link>
          <span v-if="playlist.followers.total !== 0" class="playlist-container__banner-details__followers">
            {{
              ` • ${Intl.NumberFormat().format(playlist.followers.total)} ${$t(
                'playlist.follower',
                playlist.followers.total
              )}`
            }}
          </span>
          <span v-if="playlist.tracks.total !== 0" class="playlist-container__banner-details__total-tracks">
            {{ ` • ${playlist.tracks.total} ${$t('playlist.song', playlist.tracks.total)}` }}
          </span>
          <span v-if="playlist.tracks.total !== 0" class="playlist-container__banner-details__duration">
            {{
              ` •
            ${duration.hr ? `${duration.hr} ${$t('playlist.duration.hr')} ` : ''}${duration.min ? `${duration.min}
            ${$t('playlist.duration.min')} ` : ''
              }${duration.sec ? `${duration.sec} ${$t('playlist.duration.sec')} ` : ''}`
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
          <TrackCard v-for="(item, index) in tracks" :key="item.id" :item="item.track" :index="index"
            :context_uri="this.playlist.uri" />
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="playlist-container">
      <div class="playlist-container__banner">
        <Banner :loading="loading_skeleton" />
      </div>
      <div class="playlist-container__content">
        <div class="playlist-container__content__btn-group">
          <div class="playlist-container__content__btn-group__play-wrapper">
            <Skeleton shape="circle" />
          </div>
        </div>
        <div class="playlist-container__content__tracks">
          <TrackListHeader :loading="loading_skeleton" />
          <TrackCard v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import TrackCard from '@/components/CardTrack/index.vue'
import { getNextPlaylistTracks, getPlaylist, getPlaylistTracks } from '@/api/meta/playlist'
import { timeFormatAlbum } from '@/utils/time_format'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import Banner from '@/components/Banner/index.vue'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'Playlist',
  components: {
    TrackListHeader,
    TrackCard,
    Banner,
    ButtonTogglePlay,
    Skeleton
  },
  data() {
    return {
      id: this.$route.params.playlistId,
      playlist: {},
      tracks: [],
      tracks_limit: 28,
      tracks_offset: 0,
      tracks_next: '',
      loading_skeleton: true
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore']),
    duration() {
      return timeFormatAlbum(
        this.playlist.tracks.items.reduce((acc, item) => {
          return acc + (item.track !== null ? item.track.duration_ms : 0)
        }, 0)
      )
    }
  },
  methods: {
    async getAll() {
      await this.getPlaylist()
      await this.getPlaylistTracks()

      this.loading_skeleton = false
    },
    async getPlaylist() {
      let res = await getPlaylist(this.id)
      this.playlist = res
    },
    async getPlaylistTracks() {
      if (!this.loading_more && this.tracks_next !== null) {
        this.loading_more = true
        let res

        if (this.tracks_next === '') {
          const params = {
            limit: this.tracks_limit,
            offset: this.tracks_offset
          }
          res = await getPlaylistTracks(this.id, params)
        } else {
          let path = this.tracks_next
          res = await getNextPlaylistTracks(this.id, path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.tracks))
        this.tracks = [...oldVals, ...newVals]
        this.tracks_next = res.next

        this.loading_more = false
      }
      this.loadMore = false
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.loading = false
        this.loading_skeleton = true
        await this.getAll()
      },
      immediate: true
    },
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getPlaylistTracks()
      }
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
    padding: $gutter-1-5x;

    &__btn-group {
      padding: $gutter-1-5x;

      &__play-wrapper {
        height: 5.4rem;
        aspect-ratio: 1 / 1;
      }
    }

    &__tracks {
      @include respondContainer(phone) {
        margin: $gutter-1-5x 0;
      }
    }
  }
}
</style>
