<template>
  <Container :loading>
    <div class="artist-container">
      <div
        class="artist-container__cover"
        :style="{
          'background-image': `url(${artist.images.length !== 0 ? artist.images[0].url : ''})`
        }"
      >
        <h1 class="artist-container__cover__title">{{ artist.name }}</h1>
        <div class="artist-container__cover__followers">
          {{
            Intl.NumberFormat().format(artist.followers.total) +
            (artist.followers.total === '1' ? ' follower' : ' followers')
          }}
        </div>
      </div>
      <div class="artist-container__content">
        <div v-if="tracks.length !== 0" class="artist-container__content__popular">
          <TitleSimple :title="'Popular'" />
          <div class="artist-container__content__popular__content">
            <TrackListHeader />
            <TrackCard
              v-for="(track, index) in tracks"
              :key="track.id"
              :index="index"
              :showArtists="false"
              :item="track"
            />
          </div>
        </div>
        <TitleWithPartialItems
          v-if="albums.length !== 0"
          :router-name="'ArtistAllAlbums'"
          :title="'Albums'"
          :album-card-props="{ items: albums, showAlbumType: true, showArtists: false }"
        />
        <TitleWithPartialItems
          v-if="singles.length !== 0"
          :router-name="'ArtistAllSingles'"
          :title="'Singles'"
          :album-card-props="{ items: singles, showAlbumType: true, showArtists: false }"
        />
        <TitleWithPartialItems
          v-if="appearsOn.length !== 0"
          :router-name="'ArtistAllAppearsOn'"
          :title="'Appears On'"
          :album-card-props="{ items: appearsOn, showAlbumType: true, showArtists: false }"
        />
      </div>
    </div>
  </Container>
</template>

<script>
import TrackCard from '@/components/CardTrack/index.vue'
import TrackListHeader from '@/components/HeaderTrackList/index.vue'
import { getAlbums, getAppearsOn, getArtist, getSingles, getTopTracks } from '@/api/artist'
import AlbumCard from '@/components/CardAlbum/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import TitleWithPartialItems from '@/components/TitleWithPartialItems/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import Container from '@/components/Container/index.vue'

export default {
  name: 'Artist',
  components: {
    TrackListHeader,
    TrackCard,
    AlbumCard,
    ArtistCard,
    TitleWithPartialItems,
    TitleSimple,
    Container
  },
  data() {
    return {
      id: this.$route.params.artistId,
      artist: {},
      tracks: {},
      albums: {},
      singles: {},
      appearsOn: {},
      loading: true
    }
  },
  methods: {
    async getAll() {
      await this.getArtist()
      await this.getTopTracks()
      await this.getAlbums()
      await this.getSingles()
      await this.getAppearsOn()
      this.loading = false
    },
    async getArtist() {
      const res = (await getArtist(this.id)).data
      this.artist = res
    },
    async getTopTracks() {
      const res = (await getTopTracks(this.id)).data.tracks
      this.tracks = res
    },
    async getAlbums() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getAlbums(this.id, params)).data.items
      this.albums = res
    },
    async getSingles() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getSingles(this.id, params)).data.items
      this.singles = res
    },
    async getAppearsOn() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getAppearsOn(this.id, params)).data.items
      this.appearsOn = res
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.loading = true
        this.id = to.params.artistId
        await this.getAll()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  &__cover {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 50%;
    padding: 6.4rem 3.2rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    &__title {
      font-size: 9.6rem;
      font-family: $font-family-title;
      font-weight: 800;
      text-shadow: 0 0 15px rgba(0, 0, 0, 0.4);
      // Prevent shadows from being hidden due to 'overflow:hidden'
      margin: -2rem;
      padding: 2rem;

      @include oneLineEllipsis;
    }

    &__followers {
      font-size: 1.6rem;
      text-shadow: 0 0 10px rgba(0, 0, 0, 1);
    }
  }

  &__content {
    padding: 1.6rem;
    &__popular {
      padding: 1.6rem 0;
    }
  }
}
</style>
