<template>
  <template v-if="!loading_skeleton">
    <div class="playlist-container">
      <div class="playlist-container__banner">
        <Banner :type="$t('playlist.type')" :title="playlist.name" :images="playlist.images">
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
        </Banner>
      </div>
      <div class="playlist-container__content">
        <div class="playlist-container__content__btn-group">
          <div v-if="tracks.length" class="playlist-container__content__btn-group__play-wrapper">
            <ButtonTogglePlay :item="playlist" />
          </div>
          <div v-if="!isOwner" class="playlist-container__content__btn-group__follow-wrapper">
            <button
              class="playlist-container__content__btn-group__follow-wrapper__btn"
              @click="handleClickFollowButton"
            >
              {{ isFollowed ? $t('playlist.following') : $t('playlist.follow') }}
            </button>
          </div>
          <div v-if="isOwner" class="playlist-container__content__btn-group__more">
            <DropDown position="right">
              <template #default>
                <button class="playlist-container__content__btn-group__more__btn">
                  <div class="playlist-container__content__btn-group__more__btn__icon-wrapper">
                    <IconMore />
                  </div>
                </button>
              </template>
              <template #dropDownItems>
                <DropDownItem @click="openEditDialog = true">
                  <template #icon>
                    <div
                      class="playlist-container__content__btn-group__more__drop-down-item__icon-wrapper"
                    >
                      <IconEdit />
                    </div>
                  </template>
                  <template #default>
                    {{ $t('drop_down_playlist.edit_details') }}
                  </template>
                </DropDownItem>
                <DropDownItem @click="openRemoveConfirm = true">
                  <template #icon>
                    <div
                      class="playlist-container__content__btn-group__more__drop-down-item__icon-wrapper"
                    >
                      <IconRemove />
                    </div>
                  </template>
                  <template #default>
                    {{ $t('drop_down_playlist.remove') }}
                  </template>
                </DropDownItem>
              </template>
            </DropDown>
          </div>
        </div>
        <div class="playlist-container__content__tracks">
          <TrackListHeader v-if="tracks.length" />
          <TrackCard
            v-for="(item, index) in tracks"
            :key="item.id"
            :item="item.track"
            :index="index"
            :context_uri="this.playlist.uri"
          />
        </div>
      </div>
    </div>
    <DialogPlaylistEdit
      v-model="openEditDialog"
      :item="playlist"
      @update-succeed="handleUpdateSucceed"
    />
    <ConfirmBox
      v-model="openRemoveConfirm"
      @confirm="handleConfirmed"
      :title="$t('confirm_box_playlist_delete.title')"
      :message="$t('confirm_box_playlist_delete.message', { name: playlist.name })"
    />
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
          <div class="playlist-container__content__btn-group__follow-wrapper">
            <Skeleton class="skeleton__button" />
          </div>
          <div class="playlist-container__content__btn-group__more">
            <Skeleton shape="round" />
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
import Message from '@/components/Message'
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import DropDown from '@/components/DropDown/index.vue'
import DropDownItem from '@/components/DropDownItem/index.vue'
import IconMore from '@/components/Icons/IconMore.vue'
import IconEdit from '@/components/Icons/IconEdit.vue'
import DialogPlaylistEdit from '@/components/DialogPlaylistEdit/index.vue'
import IconRemove from '@/components/Icons/IconRemove.vue'
import ConfirmBox from '@/components/ConfirmBox/index.vue'

export default {
  name: 'Playlist',
  inject: ['bottom'],
  components: {
    TrackListHeader,
    TrackCard,
    Banner,
    ButtonTogglePlay,
    Skeleton,
    DropDown,
    DropDownItem,
    IconMore,
    IconEdit,
    DialogPlaylistEdit,
    IconRemove,
    ConfirmBox
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
      isFollowed: null,
      openEditDialog: false,
      openRemoveConfirm: false
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
    async handleConfirmed() {
      const res = await deleteUserSavedPlaylists(this.playlist.id)
      this.$router.push({ name: 'Home' })
      this.openRemoveConfirm = false
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
    },
    async getAll() {
      await this.getPlaylist()
      await this.getPlaylistTracks()
      await this.checkUserSavedPlaylist()

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

        let newVals = res.items.filter((item) => item.track !== null)
        let oldVals = JSON.parse(JSON.stringify(this.tracks))
        this.tracks = [...oldVals, ...newVals]
        this.tracks_next = res.next

        this.loading_more = false
      }
    },
    async checkUserSavedPlaylist() {
      const res = await checkUserSavedPlaylists(this.playlist.id)
      this.isFollowed = res[0]
    },
    async handleClickFollowButton() {
      if (this.isFollowed) {
        await deleteUserSavedPlaylists(this.playlist.id)
        await this.checkUserSavedPlaylist()
        if (!this.isFollowed) {
          Message(`${this.$t('message.removed_from_lib')}`)
        }
      } else {
        await savePlaylists(this.playlist.id)
        await this.checkUserSavedPlaylist()
        if (this.isFollowed) {
          Message(`${this.$t('message.added_to_lib')}`)
        }
      }
    },
    handleUpdateSucceed() {
      this.getPlaylist()
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.reset()
        await this.getAll()
      },
      immediate: true
    },
    bottom(newVal, oldVal) {
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
      display: flex;
      justify-content: start;
      align-items: center;
      gap: $gutter-4x;

      &__play-wrapper {
        height: 5.4rem;
        aspect-ratio: 1 / 1;
      }

      &__follow-wrapper {
        &__btn {
          border: 1px solid $color-bg-7;
          padding: 0 $gutter-2x;
          height: 3.2rem;
          font-size: $font-size-text-secondary;
          font-weight: 700;
          border-radius: 1.6rem;
          display: flex;
          align-items: center;
          justify-content: center;

          @include clickAnimation;

          &:hover {
            border-color: $color-font-primary;
          }

          &:active {
            border-color: $color-bg-7;
          }
        }
      }

      &__more {
        height: 2.4rem;
        aspect-ratio: 3 / 2;

        &__btn {
          height: 2.4rem;

          @include clickAnimation;

          &__icon-wrapper {
            height: 100%;
            width: 100%;
            fill: $color-font-secondary;
          }
        }

        &__drop-down-item {
          &__icon-wrapper {
            margin-right: $gutter-1-5x;
            height: calc($font-size-text-primary + 0.2rem);
            aspect-ratio: 1 / 1;
            fill: $color-font-secondary;
          }
        }
      }
    }

    &__tracks {
      padding: 0 $gutter-1-5x;
      margin: $gutter-1-5x 0;
    }
  }
}
</style>
