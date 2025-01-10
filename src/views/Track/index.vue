<template>
  <template v-if="!loading_skeleton">
    <div class="track-container">
      <div class="track-container__banner">
        <Banner :type="$t('track.type')" :title="track.name" :images="track.album.images">
          <div class="track-container__banner-details">
            <router-link
              class="track-container__banner-details__artist"
              :to="{ name: 'Artist', params: { artistId: artists[0].id } }"
              >{{ artists[0].name }}</router-link
            >
            <span class="track-container__banner-details__album-wrapper">
              <span> • </span>
              <router-link
                class="track-container__banner-details__album-wrapper__album"
                :to="{ name: 'Album', params: { albumId: track.album.id } }"
                >{{ track.album.name }}</router-link
              >
            </span>
            <span class="track-container__banner-details__release-year">
              {{ ` • ${track.album.release_date.split('-')[0]}` }}
            </span>
            <span class="track-container__banner-details__duration">
              {{
                ` •
              ${duration.hr ? `${duration.hr} ${$t('track.duration.hr')} ` : ''}${
                duration.min
                  ? `${duration.min}
              ${$t('track.duration.min')} `
                  : ''
              }${duration.sec ? `${duration.sec} ${$t('track.duration.sec')} ` : ''}`
              }}
            </span>
          </div>
        </Banner>
      </div>
      <div class="track-container__content">
        <div class="track-container__content__btn-group">
          <div class="track-container__content__btn-group__play-wrapper">
            <ButtonTogglePlay :item="track" />
          </div>
          <div class="track-container__content__btn-group__add-wrapper">
            <ButtonSave
              :saved
              @button-click="handleClickSaveButton"
              :loading="loading_toggle_save"
            />
          </div>
          <div class="track-container__content__btn-group__more">
            <DropDown v-model="show_menu">
              <template #default>
                <button
                  v-tooltip="$t('tooltip.more_options', { item: track.name })"
                  class="track-container__content__btn-group__more__btn"
                >
                  <div class="track-container__content__btn-group__more__btn__icon-wrapper">
                    <IconMore />
                  </div>
                </button>
              </template>
              <template #dropDownItems>
                <DropDownSecondary
                  @handle-mouse-enter="show_menu_secondary = true"
                  v-model="show_menu_secondary"
                >
                  <template #default>
                    <DropDownItem>
                      <template #icon>
                        <div
                          class="track-container__content__btn-group__more__drop-down-item__icon-wrapper"
                        >
                          <IconPlus />
                        </div>
                      </template>
                      <template #default>
                        {{ $t('drop_down.add_to_playlist') }}
                      </template>
                      <template #right>
                        <div
                          class="track-container__content__btn-group__more__drop-down-item__icon-wrapper"
                        >
                          <IconTriangleRight />
                        </div>
                      </template>
                    </DropDownItem>
                  </template>
                  <template #dropDownItems>
                    <div
                      class="track-container__content__btn-group__more__drop-down-item-secondary"
                    >
                      <DropDownItem
                        @item-click="closeMenu"
                        v-for="item in playlists_by_user"
                        :key="item.id"
                        >{{ item.name }}</DropDownItem
                      >
                    </div>
                  </template>
                </DropDownSecondary>
                <DropDownItem @item-click="closeMenu" @mouseenter="show_menu_secondary = false">{{
                  $t('drop_down.add_to_playlist')
                }}</DropDownItem>
              </template>
            </DropDown>
          </div>
        </div>
        <div class="track-container__content__artists">
          <TitleShowAll :title="$t('track.all_artists')" />
          <div class="track-container__content__artists__results">
            <ArtistCard v-for="artist in artists" :key="artist.id" :item="artist" />
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="track-container">
      <div class="track-container__banner">
        <Banner :loading="loading_skeleton" />
      </div>
      <div class="track-container__content">
        <div class="track-container__content__btn-group">
          <div class="track-container__content__btn-group__play-wrapper">
            <Skeleton shape="circle" />
          </div>
          <div class="track-container__content__btn-group__add-wrapper">
            <Skeleton shape="circle" />
          </div>
        </div>
        <div class="track-container__content__artists">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="track-container__content__artists__results">
            <ArtistCard :loading="loading_skeleton" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { timeFormatAlbum } from '@/utils/time_format'
import { checkUserSavedTracks, deleteUserSavedTracks, getTrack, saveTracks } from '@/api/meta/track'
import { getSeveralArtists } from '@/api/meta/artist'
import ArtistCard from '@/components/CardArtist/index.vue'
import Banner from '@/components/Banner/index.vue'
import Skeleton from '@/components/Skeleton/index.vue'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import Message from '@/components/Message/index'
import { mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useLibraryStore } from '@/stores/library'
import ButtonSave from '@/components/ButtonSave/index.vue'
import DropDown from '@/components/DropDown/index.vue'
import DropDownItem from '@/components/DropDownItem/index.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import IconMore from '@/components/Icons/IconMore.vue'
import IconTriangleRight from '@/components/Icons/IconTriangleRight.vue'
import DropDownSecondary from '@/components/DropDownSecondary/index.vue'

export default {
  name: 'Track',
  components: {
    TitleShowAll,
    ArtistCard,
    Banner,
    Skeleton,
    ButtonTogglePlay,
    ButtonSave,
    DropDown,
    DropDownItem,
    IconPlus,
    IconMore,
    IconTriangleRight,
    DropDownSecondary
  },
  data() {
    return {
      id: this.$route.params.trackId,
      track: {},
      saved: undefined,
      artists: [],
      loading_skeleton: true,
      loading_toggle_save: false,
      show_menu_secondary: false,
      show_menu: false
    }
  },
  computed: {
    duration() {
      return timeFormatAlbum(this.track.duration_ms)
    },
    ...mapWritableState(usePlayerStore, {
      current_track: 'current_track',
      isSavedGlobal: 'saved'
    }),
    ...mapWritableState(useLibraryStore, { playlists_by_user: 'playlists_by_user' })
  },
  methods: {
    closeMenu() {
      this.show_menu_secondary = false
      this.show_menu = false
    },
    async reset() {
      this.id = this.$route.params.trackId
      this.track = {}
      this.artists = []
      this.loading_skeleton = true
    },
    async checkUserSavedTrack() {
      this.saved = (await checkUserSavedTracks({ ids: this.id }))?.[0]
    },
    async getAll() {
      await this.getTrack()
      await Promise.all([this.getArtists(), this.checkUserSavedTrack()])

      this.loading_skeleton = false
    },
    async getTrack() {
      const res = await getTrack(this.id)
      this.track = res
    },
    async getArtists() {
      let params = {
        ids: this.track.artists.reduce((acc, item) => {
          return acc + (acc !== '' ? ',' : '') + item.id
        }, '')
      }
      const res = (await getSeveralArtists(params)).artists
      this.artists = res
    },
    async handleClickSaveButton() {
      this.loading_toggle_save = true
      if (this.saved) {
        await deleteUserSavedTracks({ ids: this.id })
        this.saved = false
        useLibraryStore().removeSong(this.track.id)
        Message(`${this.$t('message.removed_from_lib')}`)
      } else {
        await saveTracks({ ids: this.id })
        this.saved = true
        useLibraryStore().addSongs(this.track)
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
    isSavedGlobal: {
      handler(newVal) {
        if (this.current_track?.id === this.id) {
          this.saved = newVal
        }
      }
    },
    saved: {
      handler(newVal) {
        if (this.current_track?.id === this.id) {
          this.isSavedGlobal = newVal
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.track-container {
  &__banner-details {
    @include twoLineEllipsis;

    &__artist {
      font-weight: 700;
      color: $color-font-primary;
    }

    &__album-wrapper {
      &__album {
        color: $color-font-primary;
      }
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
        height: 5.6rem;
        aspect-ratio: 1 / 1;
      }

      &__add-wrapper {
        height: 2.4rem;
        aspect-ratio: 1 / 1;
        fill: $color-font-secondary;
        cursor: pointer;

        @include clickAnimation;
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
            height: calc($font-size-text-primary);
            aspect-ratio: 1 / 1;
            fill: $color-font-secondary;
          }
        }
      }
    }

    &__artists__results {
      @include gridCards;
    }
  }
}
</style>
