<template>
  <MyOverlayScrollbars :os-class="'album-container'" :os-element="'main'">
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
            <router-link
              class="album-container__cover__info__details__artist"
              v-for="(artist, index) in album.artists"
              :to="{ name: 'Artist', params: { artistId: artist.id } }"
              >{{ index === 0 ? artist.name : ` • ${artist.name}` }}</router-link
            >
            <span class="album-container__cover__info__details__release-year">
              {{ ` • ${album.release_date.split('-')[0]}` }}
            </span>
            <span class="album-container__cover__info__details__total-tracks">
              {{ ` • ${album.total_tracks} songs` }}
            </span>
          </div>
        </div>
      </div>
      <div class="album-container__content">
        <TitleSimple :title="'Songs'" />
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
  </MyOverlayScrollbars>
</template>

<script>
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import Loading from '@/components/Loading/index.vue'
import album from './album.json'
import tracks from './tracks.json'
import TitleSimple from '@/components/TitleSimple/index.vue'
import TrackListHeader from '@/components/TrackListHeader/index.vue'
import TrackCard from '@/components/TrackCard/index.vue'
import { getAlbum, getTracks } from '@/api/album'

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
  height: inherit;

  &__cover {
    padding: 2rem;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-3);
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
        line-height: 1.2;

        @include oneLineEllipsis;
      }

      &__details {
        font-size: 1.4rem;
        color: $color-font-secondary;

        &__artist {
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
    padding: 2.4rem;
  }
}
</style>
