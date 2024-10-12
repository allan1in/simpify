<template>
  <MyOverlayScrollbars v-if="!loading" :os-class="'artist-container'" :os-element="'main'">
    <div
      class="artist-container__cover"
      :style="{
        'background-image': `url(${artist.images.length !== 0 ? artist.images[0].url : ''})`
      }"
    >
      <div class="artist-container__cover__title">{{ artist.name }}</div>
      <div class="artist-container__cover__followers">
        {{
          Intl.NumberFormat().format(artist.followers.total) +
          (artist.followers.total === '1' ? ' follower' : ' followers')
        }}
      </div>
    </div>
    <div class="artist-container__content">
      <div v-if="tracks.length !== 0" class="artist-container__content__popular">
        <div class="artist-container__content__popular__title">Popular</div>
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
      <div v-if="albums.length !== 0" class="artist-container__content__albums">
        <a class="artist-container__content__albums__title">Albums</a>
        <div class="artist-container__content__albums__content">
          <AlbumCard
            v-for="item in albums"
            :key="item.id"
            :item="item"
            :show-album-type="true"
            :show-artists="false"
          />
        </div>
      </div>
      <div v-if="singles.length !== 0" class="artist-container__content__singles">
        <a class="artist-container__content__singles__title">Singles</a>
        <div class="artist-container__content__singles__content">
          <AlbumCard
            v-for="item in singles"
            :key="item.id"
            :item="item"
            :show-album-type="true"
            :show-artists="false"
          />
        </div>
      </div>
      <div v-if="appearsOn.length !== 0" class="artist-container__content__appears-on">
        <a class="artist-container__content__appears-on__title">Appears On</a>
        <div class="artist-container__content__appears-on__content">
          <AlbumCard
            v-for="item in appearsOn"
            :key="item.id"
            :item="item"
            :show-album-type="true"
            :show-artists="false"
          />
        </div>
      </div>
      <div v-if="compilations.length !== 0" class="artist-container__content__compilations">
        <a class="artist-container__content__compilations__title">Compilations</a>
        <div class="artist-container__content__compilations__content">
          <AlbumCard
            v-for="item in compilations"
            :key="item.id"
            :item="item"
            :show-album-type="true"
            :show-artists="false"
          />
        </div>
      </div>
    </div>
  </MyOverlayScrollbars>
</template>

<script>
import TrackCard from '@/components/TrackCard/index.vue'
import TrackListHeader from '@/components/TrackListHeader/index.vue'
import artist from './artist.json'
import tracks from './tracks.json'
import albums from './albums.json'
import singles from './singles.json'
import appearsOn from './appearsOn.json'
import compilations from './compilations'
import MyOverlayScrollbars from '@/components/MyOverlayScrollbars/index.vue'
import {
  getAlbums,
  getAppearsOn,
  getArtist,
  getCompilations,
  getSingles,
  getTopTracks
} from '@/api/artists'
import AlbumCard from '@/components/AlbumCard/index.vue'
import ArtistCard from '@/components/ArtistCard/index.vue'

export default {
  name: 'Artist',
  components: {
    MyOverlayScrollbars,
    TrackListHeader,
    TrackCard,
    AlbumCard,
    ArtistCard
  },
  data() {
    return {
      id: this.$route.params.artistId,
      artist: {},
      tracks: {},
      albums: {},
      singles: {},
      appearsOn: {},
      compilations: {},
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
      await this.getCompilations()
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
      console.log(res)
      this.singles = res
    },
    async getAppearsOn() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getAppearsOn(this.id, params)).data.items
      this.appearsOn = res
    },
    async getCompilations() {
      const params = {
        limit: 7,
        offset: 0
      }
      const res = (await getCompilations(this.id, params)).data.items
      this.compilations = res
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
  height: inherit;

  &__cover {
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 50%;
    padding: 6rem 2.4rem;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;

    &__title {
      font-size: 9.6rem;
      font-family: $font-family-title;
      font-weight: 800;
      text-shadow: 0 0 15px rgba(0, 0, 0, 0.4);

      @include oneLineEllipsis;
    }

    &__followers {
      font-size: 1.6rem;
      text-shadow: 0 0 10px rgba(0, 0, 0, 1);
    }
  }

  &__content {
    padding: 2.4rem;
    &__popular {
      padding: 2.4rem 0;
      &__title {
        margin-bottom: 1.6rem;

        @include titleStyles;
      }
    }

    &__albums,
    &__singles,
    &__appears-on,
    &__compilations {
      padding: 2.4rem 0;
      &__title {
        display: inline-block;
        margin: 1.6rem 0;

        @include titleStyles;
      }

      &__content {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
      }
    }
  }
}
</style>
