<template>
  <div class="track-container" v-if="!loading">
    <div class="track-container__banner">
      <Banner :item="track" :img-url="track.album.images[0].url">
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
          {{ ` • ${getFormatTime(track.duration_ms)}` }}
        </span>
      </Banner>
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
import Banner from '@/components/Banner/index.vue'

export default {
  name: 'Track',
  components: {
    TitleShowAll,
    ArtistCard,
    Banner
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
      const res = await getTrack(this.$route.params.trackId)
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
    padding: 1.6rem;

    &__artists {
      @include gridCards;
    }
  }
}
</style>
