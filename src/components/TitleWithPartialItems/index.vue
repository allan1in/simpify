<template>
  <section class="title-with-partial-items">
    <TitleShowAll :router-name="routerName" :title="title" />
    <div class="title-with-partial-items__content">
      <ArtistCard
        v-if="artistCardProps"
        v-for="(item, index) in artistCardProps.items"
        :key="index"
        :item="item"
        :index="index"
      />
      <AlbumCard
        v-else-if="albumCardProps"
        v-for="(item, index) in albumCardProps.items"
        :key="item.id"
        :item="item"
        :index="index"
        :show-artists="albumCardProps.showArtists"
        :show-album-type="albumCardProps.showAlbumType"
      />
    </div>
  </section>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import ArtistCard from '@/components/ArtistCard/index.vue'
import AlbumCard from '@/components/AlbumCard/index.vue'

export default {
  name: 'TitleWithPartialItems',
  components: {
    TitleShowAll,
    ArtistCard,
    AlbumCard
  },
  props: {
    routerName: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
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
    }
  }
}
</script>

<style lang="scss" scoped>
.title-with-partial-items {
  padding-top: 2.4rem;

  &__content {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
