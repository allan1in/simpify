<template>
  <template v-if="!loading_skeleton">
    <div class="playlist-container">
      <div class="playlist-container__banner">
        <Banner :type="$t('playlist.type')" :title="playlist.name" :images="playlist.images">
          <div class="playlist-container__banner-description">
            <span v-tooltip="playlist.description">{{ playlist.description }}</span>
          </div>
          <div class="playlist-container__banner-details">
            <router-link
              class="playlist-container__banner-details__owner"
              :to="{ name: 'User', params: { userId: playlist.owner.id } }"
              >{{ playlist.owner.display_name }}</router-link
            >
            <span
              v-if="playlist.followers.total !== 0"
              class="playlist-container__banner-details__followers"
            >
              {{
                ` • ${Intl.NumberFormat().format(playlist.followers.total)} ${$t(
                  'playlist.follower',
                  playlist.followers.total
                )}`
              }}
            </span>
            <span
              v-if="playlist.tracks.total !== 0"
              class="playlist-container__banner-details__total-tracks"
            >
              {{ ` • ${playlist.tracks.total} ${$t('playlist.song', playlist.tracks.total)}` }}
            </span>
            <span
              v-if="playlist.tracks.total !== 0"
              class="playlist-container__banner-details__duration"
            >
              {{
                ` •
              ${duration.hr ? `${duration.hr} ${$t('playlist.duration.hr')} ` : ''}${
                duration.min
                  ? `${duration.min}
              ${$t('playlist.duration.min')} `
                  : ''
              }${duration.sec ? `${duration.sec} ${$t('playlist.duration.sec')} ` : ''}`
              }}
            </span>
          </div>
        </Banner>
      </div>
      <div class="playlist-container__content">
        <div class="playlist-container__content__btn-group">
          <div v-if="tracks.length" class="playlist-container__content__btn-group__play-wrapper">
            <ButtonTogglePlay :item="playlist" />
          </div>
          <div v-if="!isOwner" class="playlist-container__content__btn-group__save-wrapper">
            <ButtonSave
              :loading="loading_toggle_save"
              :saved
              @button-click="handleClickSaveButton"
            />
          </div>
          <div v-if="isOwner" class="playlist-container__content__btn-group__more">
            <DropDownMenu :playlist @update-succeed="getPlaylist" />
          </div>
        </div>
        <div class="playlist-container__content__tracks">
          <TrackListHeader v-if="tracks.length" />
            <CardTrack
              v-for="(item, index) in tracks"
              :key="index"
              :item="item.track"
              :index="index"
              :context_uri="playlist.uri"
              :playlist="playlist"
              @update-succeed="handleUpdateSucceed"
            />
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
          <div class="playlist-container__content__btn-group__save-wrapper">
            <Skeleton shape="circle" />
          </div>
        </div>
        <div class="playlist-container__content__tracks">
          <TrackListHeader :loading="loading_skeleton" />
          <CardTrack v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import CardTrack from '@/components/CardTrack/index.vue'
import {
  checkUserSavedPlaylists,
  deleteUserSavedPlaylists,
  getNextPlaylistTracks,
  getPlaylist,
  getPlaylistTracks,
  savePlaylists
} from '@/api/meta/playlist'
import { timeFormatAlbum } from '@/utils/time_format'
import Banner from '@/components/Banner/index.vue'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import Skeleton from '@/components/Skeleton/index.vue'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import ButtonSave from '@/components/ButtonSave/index.vue'
import DropDownMenu from './DropDownMenu/index.vue'
import Message from '@/components/Message'
import { useLibraryStore } from '@/stores/library'

export default {
  name: 'Playlist',
  inject: ['bottom'],
  components: {
    TrackListHeader,
    CardTrack,
    Banner,
    ButtonTogglePlay,
    Skeleton,
    ButtonSave,
    DropDownMenu
  },
  data() {
    return {
      id: this.$route.params.playlistId,
      playlist: {},
      tracks: [],
      tracks_limit: 28,
      tracks_offset: 0,
      tracks_next: '',
      loading_skeleton: true,
      loading_more: false,
      saved: null
    }
  },
  computed: {
    ...mapState(useUserStore, ['uid']),
    isOwner() {
      return this.playlist.owner.id === this.uid
    },
    duration() {
      return timeFormatAlbum(
        this.playlist.tracks.items.reduce((acc, item) => {
          return acc + (item.track !== null ? item.track.duration_ms : 0)
        }, 0)
      )
    }
  },
  methods: {
    handleUpdateSucceed(trackId) {
      this.tracks = this.tracks.filter((item) => item.track.id !== trackId)
    },
    reset() {
      this.id = this.$route.params.playlistId
      this.playlist = {}
      this.tracks = []
      this.tracks_limit = 28
      this.tracks_offset = 0
      this.tracks_next = ''
      this.loading_skeleton = true
      this.loading_more = false
      this.loading_toggle_save = false
    },
    async getAll() {
      await Promise.all([this.getPlaylist(), this.getPlaylistTracks()])

      this.loading_skeleton = false
    },
    async getPlaylist() {
      let res = await getPlaylist(this.id)
      this.playlist = res

      await this.checkUserSavedPlaylist()
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

        let newVals = res.items.filter((item) => item.track !== null)
        let oldVals = JSON.parse(JSON.stringify(this.tracks))
        this.tracks = [...oldVals, ...newVals]
        this.tracks_next = res.next

        this.loading_more = false
      }
    },
    async checkUserSavedPlaylist() {
      const res = await checkUserSavedPlaylists(this.playlist.id)
      this.saved = res[0]
    },
    async handleClickSaveButton() {
      this.loading_toggle_save = true
      if (this.saved) {
        await deleteUserSavedPlaylists(this.playlist.id)
        this.saved = false
        useLibraryStore().removePlaylist(this.playlist.id)
        Message(`${this.$t('message.removed_from_lib')}`)
      } else {
        await savePlaylists(this.playlist.id)
        this.saved = true
        useLibraryStore().addPlaylists(this.playlist)
        Message(`${this.$t('message.added_to_lib')}`)
      }
      this.loading_toggle_save = false
    }
  },
  watch: {
    $route: {
      async handler() {
        this.reset()
        await this.getAll()
      },
      immediate: true
    },
    bottom(newVal) {
      if (newVal <= 0) {
        this.getPlaylistTracks()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  &__button {
    height: 3.2rem;
    width: 7.2rem;
    border-radius: 1.6rem;
  }
}

.playlist-container {
  &__banner-description {
    margin-bottom: $gutter;

    @include twoLineEllipsis;
  }

  &__banner-details {
    @include twoLineEllipsis;

    &__owner {
      font-weight: 700;
      color: $color-font-primary;
    }
  }

  &__content {
    padding: $gutter-1-5x;

    &__btn-group {
      padding: $gutter-1-5x;
      display: flex;
      justify-content: start;
      align-items: center;
      gap: $gutter-4x;

      &__play-wrapper {
        height: 5.4rem;
        aspect-ratio: 1 / 1;
      }

      &__save-wrapper {
        height: 2.4rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-secondary;
        cursor: pointer;

        @include clickAnimation;
      }
    }

    &__tracks {
      padding: 0 $gutter-1-5x;
      margin: $gutter-1-5x 0;
    }
  }
}
</style>
