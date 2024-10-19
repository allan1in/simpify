<template>
  <MyOverlayScrollbars os-element="main">
    <div class="album-container">
      <div v-if="!loading">
        <div class="album-container__cover">
          <div class="album-container__cover__img-wrapper">
            <img
              class="album-container__cover__img-wrapper__img"
              :src="album.images[1].url"
              :alt="album.name"
            />
          </div>
          <div class="album-container__cover__info">
            <span class="album-container__cover__info__type">{{
              `${album.type.charAt(0).toUpperCase()}${album.type.slice(1)}`
            }}</span>
            <h1 class="album-container__cover__info__title">{{ album.name }}</h1>
            <div class="album-container__cover__info__details">
              <span
                v-for="(artist, index) in album.artists"
                class="album-container__cover__info__details__artist"
              >
                {{ index === 0 ? '' : ' • ' }}
                <router-link
                  class="album-container__cover__info__details__artist__link"
                  :to="{ name: 'Artist', params: { artistId: artist.id } }"
                  >{{ artist.name }}</router-link
                >
              </span>

              <span class="album-container__cover__info__details__release-year">
                {{ ` • ${album.release_date.split('-')[0]}` }}
              </span>
              <span class="album-container__cover__info__details__total-tracks">
                {{ ` • ${album.total_tracks} songs` }}
              </span>
              <span class="album-container__cover__info__details__duration">
                {{
                  ` • ${getFormatTime(
                    tracks.reduce((acc, track) => {
                      return acc + track.duration_ms
                    }, 0)
                  )}`
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="album-container__content">
          <TrackListHeader :showAlbum="false" />
          <TrackCard
            v-for="(item, index) in tracks"
            :item="item"
            :index="index"
            :show-album="false"
            :show-image="false"
          />
        </div>
      </div>
      <Loading :loading />
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import TrackListHeader from '@/components/TrackListHeader/index.vue'
import TrackCard from '@/components/TrackCard/index.vue'
import { getAlbum, getTracks } from '@/api/album'
import { timeFormatAlbum } from '@/utils/time_format'

export default {
  name: 'Album',
  components: {
    MyOverlayScrollbars,
    Loading,
    TitleSimple,
    TrackListHeader,
    TrackCard
  },
  data() {
    return {
      id: this.$route.params.albumId,
      album: {},
      tracks: {},
      loading: false
    }
  },
  methods: {
    getFormatTime(time) {
      return timeFormatAlbum(time)
    },
    async getAll() {
      await this.getAlbum()
      await this.getTracks()
      this.loading = false
    },
    async getAlbum() {
      const res = (await getAlbum(this.id)).data
      this.album = res
    },
    async getTracks() {
      const params = {
        limit: 50,
        offset: 0
      }
      const res = (await getTracks(this.id, params)).data.items
      this.tracks = res
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.loading = true
        await this.getAll()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.album-container {
  height: $height-content;
  min-height: $height-content;

  &__cover {
    padding: 2rem;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    display: flex;
    align-items: end;
    justify-content: start;
    gap: 2.5rem;

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

        @include twoLineEllipsis;

        &__artist__link {
          font-weight: 700;
          color: $color-font-primary;
        }
      }
    }
  }

  &__content {
    padding: 2.4rem;
  }
}
</style>
