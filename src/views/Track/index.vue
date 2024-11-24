<template>
  <template v-if="!loading_skeleton">
    <div class="track-container">
      <div class="track-container__banner">
        <Banner :type="$t('track.type')" :title="track.name" :images="track.album.images">
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
              duration.min ? `${duration.min} ${$t('track.duration.min')} ` : ''
            }${duration.sec ? `${duration.sec} ${$t('track.duration.sec')} ` : ''}`
            }}
          </span>
        </Banner>
      </div>

      <div class="track-container__content">
        <div class="track-container__content__btn-group">
          <div class="track-container__content__btn-group__play-wrapper">
            <ButtonTogglePlay :item="track" />
          </div>
          <div
            class="track-container__content__btn-group__add-wrapper"
            @click.prevent="handleClickSaveButton"
          >
            <IconInLikeSong v-show="isSaved" />
            <IconAddToLikeSong v-show="!isSaved" />
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
import IconAddToLikeSong from '@/components/Icons/IconAddToLikeSong.vue'
import IconInLikeSong from '@/components/Icons/IconInLikeSong.vue'
import Message from '@/components/Message/index'

export default {
  name: 'Track',
  components: {
    TitleShowAll,
    ArtistCard,
    Banner,
    Skeleton,
    ButtonTogglePlay,
    IconAddToLikeSong,
    IconInLikeSong
  },
  data() {
    return {
      id: this.$route.params.trackId,
      track: {},
      artists: [],
      isSaved: undefined,
      loading_skeleton: true
    }
  },
  computed: {
    duration() {
      return timeFormatAlbum(this.track.duration_ms)
    }
  },
  methods: {
    reset() {
      this.id = this.$route.params.trackId
      this.track = {}
      this.artists = []
      this.isSaved = undefined
      this.loading_skeleton = true
    },
    async getAll() {
      await this.getTrack()
      await this.getArtists()
      await this.checkUserSavedTrack()

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
    async checkUserSavedTrack() {
      let params = { ids: this.id }
      const res = await checkUserSavedTracks(params)
      this.isSaved = res[0]
    },
    async handleClickSaveButton() {
      if (this.isSaved) {
        await deleteUserSavedTracks({ ids: this.id })
        await this.checkUserSavedTrack()
        if (!this.isSaved) {
          Message('Removed from Liked Songs')
        }
      } else {
        await saveTracks({ ids: this.id })
        await this.checkUserSavedTrack()
        if (this.isSaved) {
          Message('Added to Liked Songs')
        }
      }
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.reset()
        await this.getAll()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.track-container {
  &__banner-details {
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
    }

    &__artists__results {
      @include gridCards;
    }
  }
}
</style>
