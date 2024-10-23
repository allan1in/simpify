<template>
  <section class="title-with-partial-items">
    <TitleShowAll :router-name="total>limit?routerName:''" :title="title" />
    <div class="title-with-partial-items__content">
      <ArtistCard
        v-if="artistCardProps"
        v-for="(item, index) in artistCardProps.items"
        :key="'artist' + item.id"
        :item="item"
        :index="index"
      />
      <AlbumCard
        v-else-if="albumCardProps"
        v-for="(item, index) in albumCardProps.items"
        :key="'album' + item.id"
        :item="item"
        :index="index"
        :show-artists="albumCardProps.showArtists"
        :show-album-type="albumCardProps.showAlbumType"
      />
      <PlaylistCard
        v-else-if="playlistCardProps"
        v-for="(item, index) in playlistCardProps.items"
        :key="'playlist' + item.id"
        :item="item"
      />
    </div>
  </section>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import ArtistCard from '@/components/CardArtist/index.vue'
import AlbumCard from '@/components/CardAlbum/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'

export default {
  name: 'TitleWithPartialItems',
  components: {
    TitleShowAll,
    ArtistCard,
    AlbumCard,
    PlaylistCard
  },
  props: {
    routerName: {
      type: String,
      require: false,
      default:''
    },
    title: {
      type: String,
      require: true
    },
    limit:{
      type: Number,
      require: false,
      default:0
    },
    total:{
      type: Number,
      require: false,
      default:0
    },
    albumCardProps: {
      type: Object,
      require: false,
      default: undefined
    },
    artistCardProps: {
      type: Object,
      require: false,
      default: undefined
    },
    playlistCardProps: {
      type: Object,
      require: false,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.title-with-partial-items {
  padding-top: 2.4rem;

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
  }
}
</style>
