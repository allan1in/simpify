<template>
  <section class="title-with-partial-items">
    <TitleShowAll :router-name="routerName" :title="title" />
    <div class="title-with-partial-items__content">
      <ArtistCard
        v-if="cardType === 'ArtistCard'"
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :index="index"
      />
      <AlbumCard
        v-else-if="cardType === 'AlbumCard'"
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :index="index"
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
    cardType: {
      type: String,
      require: true
    },
    items: {
      type: Object,
      require: true
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
