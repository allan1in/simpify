<template>
  <div class="track-container" v-if="!loading">
    <div class="track-container__cover">
      <div class="track-container__cover__img-wrapper">
        <img
          class="track-container__cover__img-wrapper__img"
          :src="track.album.images[1].url"
          :alt="track.name"
        />
      </div>
      <div class="track-container__cover__info">
        <span class="track-container__cover__info__type">{{
          `${track.type.charAt(0).toUpperCase()}${track.type.slice(1)}`
        }}</span>
        <h1 class="track-container__cover__info__title">{{ track.name }}</h1>
        <div class="track-container__cover__info__details">
          <router-link
            class="track-container__cover__info__details__artist"
            :to="{ name: 'Artist', params: { artistId: artists[0].id } }"
            >{{ artists[0].name }}</router-link
          >
          <span class="track-container__cover__info__details__album-wrapper">
            <span> • </span>
            <router-link
              class="track-container__cover__info__details__album-wrapper__album"
              :to="{ name: 'Album', params: { albumId: track.album.id } }"
              >{{ track.album.name }}</router-link
            >
          </span>
          <span class="track-container__cover__info__details__release-year">
            {{ ` • ${track.album.release_date.split('-')[0]}` }}
          </span>
          <span class="track-container__cover__info__details__duration">
            {{ ` • ${getFormatTime(track.duration_ms)}` }}
          </span>
        </div>
      </div>
    </div>
    <div class="track-container__content">
      <TitleShowAll title="All Artists" />
      <div class="track-container__content__artists">
        <ArtistCard v-for="artist in artists" :key="artist.id" :item="artist" />
      </div>
    </div>
  </div>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { timeFormatAlbum } from '@/utils/time_format'
import { getTrack } from '@/api/meta/track'
import { getSeveralArtists } from '@/api/meta/artist'
import ArtistCard from '@/components/CardArtist/index.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Track',
  components: {
    TitleShowAll,
    ArtistCard
  },
  data() {
    return {
      track: {},
      artists: {}
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading'])
  },
  methods: {
    async getAll() {
      await this.getTrack()
      await this.getArtists()

      this.loading = false
    },
    getFormatTime(time) {
      return timeFormatAlbum(time)
    },
    async getTrack() {
      const res = (await getTrack(this.$route.params.trackId)).data
      this.track = res
    },
    async getArtists() {
      let params = {
        ids: this.track.artists.reduce((acc, item) => {
          return acc + (acc !== '' ? ',' : '') + item.id
        }, '')
      }
      const res = (await getSeveralArtists(params)).data.artists
      this.artists = res
    }
  },
  created() {
    this.getAll()
  },
  beforeUnmount() {
    this.loading = true
  }
}
</script>

<style lang="scss" scoped>
.track-container {
  &__cover {
    padding: 3.2rem;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    display: flex;
    align-items: end;
    justify-content: start;
    gap: 3.2rem;

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
        font-size: 1.4rem;
        color: $color-font-secondary;

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
    }
  }

  &__content {
    padding: 1.6rem;

    &__artists {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
    }
  }
}
</style>
