<template>
  <template v-if="!loading_skeleton">
    <div class="album-container">
      <div class="album-container__cover">
        <Banner :type="$t('album.type')" :title="album.name" :images="album.images">
          <div class="album-container__banner-details">
            <span v-for="(artist, index) in album.artists" :key="artist.id"
              class="album-container__banner-details__artist">
              {{ index === 0 ? '' : ' • ' }}
              <router-link class="album-container__banner-details__artist__link"
                :to="{ name: 'Artist', params: { artistId: artist.id } }">{{ artist.name }}</router-link>
            </span>

            <span class="album-container__banner-details__release-year">
              {{ ` • ${album.release_date.split('-')[0]}` }}
            </span>
            <span v-if="album.total_tracks !== 0" class="album-container__banner-details__total-tracks">
              {{ ` • ${album.total_tracks} ${$t('album.song', album.total_tracks)}` }}
            </span>
            <span class="album-container__banner-details__duration">
              {{
                ` •
              ${duration.hr ? `${duration.hr} ${$t('album.duration.hr')} ` : ''}${duration.min
                  ? `${duration.min}
              ${$t('album.duration.min')} `
                  : ''
                }${duration.sec ? `${duration.sec} ${$t('album.duration.sec')} ` : ''}`
              }}
            </span>
          </div>
        </Banner>
      </div>
      <div class="album-container__content">
        <div class="album-container__content__btn-group">
          <div class="album-container__content__btn-group__play-wrapper">
            <ButtonTogglePlay :item="album" />
          </div>
          <ButtonSave :isSaved class="album-container__content__btn-group__add-wrapper"
            @button-click="handleClickSaveButton" />
        </div>
        <div class="album-container__content__tracks">
          <TrackListHeader :showAlbum="false" />
          <TrackCard v-for="(item, index) in tracks" :key="item.id" :item="item" :index="index" :show-album="false"
            :show-image="false" :context_uri="this.album.uri" />
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="album-container">
      <div class="album-container__cover">
        <Banner :loading="loading_skeleton" />
      </div>
      <div class="album-container__content">
        <div class="album-container__content__btn-group">
          <div class="album-container__content__btn-group__play-wrapper">
            <Skeleton shape="circle" />
          </div>
          <div class="album-container__content__btn-group__add-wrapper">
            <Skeleton shape="circle" />
          </div>
        </div>
        <div class="album-container__content__tracks">
          <TrackListHeader :showAlbum="false" :loading="loading_skeleton" />
          <TrackCard v-for="i in tracks_limit" :key="i" :show-album="false" :show-image="false"
            :loading="loading_skeleton" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import TrackCard from '@/components/CardTrack/index.vue'
import {
  getAlbum,
  getTracks,
  getNextTracks,
  deleteUserSavedAlbums,
  saveAlbums,
  checkUserSavedAlbums
} from '@/api/meta/album'
import { timeFormatAlbum } from '@/utils/time_format'
import Banner from '@/components/Banner/index.vue'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import Skeleton from '@/components/Skeleton/index.vue'
import IconSaved from '@/components/Icons/IconSaved.vue'
import IconAddTo from '@/components/Icons/IconAddTo.vue'
import Message from '@/components/Message/index'
import { useLibraryStore } from '@/stores/library'
import ButtonSave from '@/components/ButtonSave/index.vue'

export default {
  name: 'Album',
  inject: ['bottom'],
  components: {
    TrackListHeader,
    TrackCard,
    Banner,
    ButtonTogglePlay,
    Skeleton,
    IconAddTo,
    IconSaved,
    ButtonSave
  },
  data() {
    return {
      id: this.$route.params.albumId,
      album: {},
      tracks: [],
      tracks_limit: 20,
      tracks_offset: 0,
      tracks_next: '',
      loading_skeleton: true,
      loading_more: false,
      isSaved: null
    }
  },
  computed: {
    duration() {
      return timeFormatAlbum(
        this.tracks.reduce((acc, track) => {
          return acc + track.duration_ms
        }, 0)
      )
    }
  },
  methods: {
    reset() {
      this.id = this.$route.params.albumId
      this.album = {}
      this.tracks = []
      this.tracks_limit = 20
      this.tracks_offset = 0
      this.tracks_next = ''
      this.loading_more = false
      this.loading_skeleton = true
    },
    async getAll() {
      await Promise.all([
        this.getAlbum(),
        this.getTracks(),
        this.checkUserSavedAlbum()
      ])

      this.loading_skeleton = false
    },
    async getAlbum() {
      const res = await getAlbum(this.id)
      this.album = res
    },
    async getTracks() {
      if (!this.loading_more && this.tracks_next !== null) {
        this.loading_more = true
        let res

        if (this.tracks_next === '') {
          const params = {
            limit: this.tracks_limit,
            offset: this.tracks_offset
          }
          res = await getTracks(this.id, params)
        } else {
          let path = this.tracks_next
          res = await getNextTracks(this.id, path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items
        // Add album images for each track
        newVals.forEach((item) => {
          item.album = {
            images: this.album.images
          }
        })
        let oldVals = JSON.parse(JSON.stringify(this.tracks))
        this.tracks = [...oldVals, ...newVals]
        this.tracks_next = res.next

        this.loading_more = false
      }
    },
    async checkUserSavedAlbum() {
      let params = { ids: this.id }
      const res = await checkUserSavedAlbums(params)
      this.isSaved = res[0]
    },
    async handleClickSaveButton() {
      if (this.isSaved) {
        await deleteUserSavedAlbums({ ids: this.id })
        await this.checkUserSavedAlbum()
        if (!this.isSaved) {
          useLibraryStore().removeAlbum(this.id)
          Message(`${this.$t('message.removed_from_lib')}`)
        }
      } else {
        await saveAlbums({ ids: this.id })
        await this.checkUserSavedAlbum()
        if (this.isSaved) {
          useLibraryStore().addAlbums(this.album)
          Message(`${this.$t('message.added_to_lib')}`)
        }
      }
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.reset()
        this.loading_skeleton = true
        await this.getAll()
      },
      immediate: true
    },
    bottom(newVal, oldVal) {
      if (newVal <= 0) {
        this.getTracks()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.album-container {
  &__banner-details {

    @include twoLineEllipsis;

    &__artist__link {
      font-weight: 700;
      color: $color-font-primary;
    }
  }

  &__content {
    padding: $gutter-1-5x;

    &__btn-group {
      padding: $gutter-1-5x;
      display: flex;
      align-items: center;
      justify-content: start;
      gap: $gutter-4x;

      &__play-wrapper {
        height: 5.4rem;
        aspect-ratio: 1 / 1;
      }

      &__add-wrapper {
        height: 2.4rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-secondary;
        cursor: pointer;

        @include clickAnimation;
      }
    }

    &__tracks {
      margin: 0 $gutter-1-5x;

      @include respondContainer(phone) {
        margin: $gutter-1-5x 0;
      }
    }
  }
}
</style>
