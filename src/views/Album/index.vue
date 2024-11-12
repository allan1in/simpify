<template>
  <template v-if="!loading_skeleton">
    <div class="album-container">
      <div class="album-container__cover">
        <Banner :type="album.type" :title="album.name" :images="album.images">
          <span v-for="(artist, index) in album.artists" :key="artist.id"
            class="album-container__banner-details__artist">
            {{ index === 0 ? '' : ' • ' }}
            <router-link class="album-container__banner-details__artist__link"
              :to="{ name: 'Artist', params: { artistId: artist.id } }">{{ artist.name }}</router-link>
          </span>

          <span class="album-container__banner-details__release-year">
            {{ ` • ${album.release_date.split('-')[0]}` }}
          </span>
          <span class="album-container__banner-details__total-tracks">
            {{ ` • ${album.total_tracks} songs` }}
          </span>
          <span class="album-container__banner-details__duration">
            {{
              ` • ${getFormatTime(
                tracks.reduce((acc, track) => {
                  return acc + track.duration_ms
                }, 0)
              )}`
            }}
          </span>
        </Banner>
      </div>
      <div class="album-container__content">
        <div class="album-container__content__btn-group">
          <div class="album-container__content__btn-group__play-wrapper">
            <ButtonTogglePlay :item="album" />
          </div>
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
import { getAlbum, getTracks, getNextTracks } from '@/api/meta/album'
import { timeFormatAlbum } from '@/utils/time_format'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import Banner from '@/components/Banner/index.vue'
import ButtonTogglePlay from '@/components/ButtonTogglePlay/index.vue'
import Skeleton from '@/components/Skeleton/index.vue'

export default {
  name: 'Album',
  components: {
    TrackListHeader,
    TrackCard,
    Banner,
    ButtonTogglePlay,
    Skeleton
  },
  data() {
    return {
      id: this.$route.params.albumId,
      album: {},
      tracks: [],
      tracks_limit: 20,
      tracks_offset: 0,
      tracks_next: '',
      loading_more: false,
      loading_skeleton: true
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    getFormatTime(time) {
      return timeFormatAlbum(time)
    },
    async getAll() {
      await this.getAlbum()
      await this.getTracks()

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
        this.getTracks()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.album-container {
  &__banner-details {
    &__artist__link {
      font-weight: 700;
      color: $color-font-primary;
    }
  }

  &__content {
    padding: 1.6rem;

    &__btn-group {
      padding: $gutter-2x;

      &__play-wrapper {
        height: 5.4rem;
        aspect-ratio: 1 / 1;
      }
    }
  }
}
</style>
