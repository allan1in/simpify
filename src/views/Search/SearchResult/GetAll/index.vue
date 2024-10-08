<template>
  <section class="all-container">
    <div class="all-container__songs">
      <h1 class="all-container__songs__title">
        <router-link :to="{ name: 'GetTracks' }">Songs</router-link>
      </h1>
      <div class="all-container__songs__results">
        <TrackListHeader />
        <TrackCard
          v-for="(item, index) in all.tracks.items"
          :key="index"
          :item="item"
          :index="index"
        />
      </div>
    </div>
    <div class="all-container__artists">
      <h1 class="all-container__artists__title">
        <router-link :to="{ name: 'GetArtists' }">Artists</router-link>
      </h1>
      <div class="all-container__artists__results">
        <ArtistCard
          v-for="(item, index) in all.artists.items"
          :key="index"
          :item="item"
          :index="index"
        />
      </div>
    </div>
    <div class="all-container__albums">
      <h1 class="all-container__albums__title">
        <router-link :to="{ name: 'GetAlbums' }">Albums</router-link>
      </h1>
      <div class="all-container__albums__results">
        <AlbumCard
          v-for="(item, index) in all.albums.items"
          :key="index"
          :item="{
            images: item.images,
            name: item.name,
            release_date: item.release_date,
            albums: item.artists
          }"
          :index="index"
        />
      </div>
    </div>
  </section>
</template>

<script>
import AlbumCard from '../GetAlbums/AlbumCard.vue'
import ArtistCard from '../GetArtists/ArtistCard.vue'
import TrackCard from '../GetTracks/TrackCard.vue'
import TrackListHeader from '../GetTracks/TrackListHeader.vue'
import all from './all.json'

export default {
  name: 'GetAll',
  components: {
    TrackCard,
    ArtistCard,
    AlbumCard,
    TrackListHeader
  },
  data() {
    return {
      all
    }
  }
}
</script>

<style lang="scss" scoped>
.all-container {
  &__songs {
    &__title {
      font-family: $font-family-title;
      font-size: 2.4rem;
      padding-bottom: 2.4rem;
    }
  }

  &__artists {
    padding-top: 2.4rem;

    &__title {
      font-family: $font-family-title;
      font-size: 2.4rem;
      padding-bottom: 2.4rem;
    }

    &__results {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
  }

  &__albums {
    padding-top: 2.4rem;

    &__title {
      font-family: $font-family-title;
      font-size: 2.4rem;
      padding-bottom: 2.4rem;
    }

    &__results {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
  }
}
</style>
