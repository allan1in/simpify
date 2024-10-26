<template>
  <div class="artist-all-albums" v-if="!loading">
    <TitleShowAll :title="'Albums'" />
    <div class="artist-all-albums__results">
      <AlbumCard v-for="item in albums" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { getAlbums, getNextAlbums } from '@/api/meta/artist'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'ArtistAllAlbums',
  components: {
    AlbumCard,
    TitleShowAll,
    AlbumCard
  },
  data() {
    return {
      id: this.$route.params.artistId,
      albums: [],
      albums_limit: 32,
      albums_offset: 0,
      albums_next: '',
      loadingMore: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    async getAll() {
      await this.getAlbums()
      this.loading = false
    },
    async getAlbums() {
      if (!this.loadingMore && this.albums_next !== null) {
        this.loadingMore = true
        let res

        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await getAlbums(this.id, params)).data
        } else {
          let path = this.albums_next
          res = (await getNextAlbums(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))
        this.albums = [...oldVals, ...newVals]
        this.albums_next = res.next

        this.loadingMore = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getAlbums()
      }
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
.artist-all-albums {
  padding: 1.6rem;

  &__results {
    @include gridCardsPreview;
  }
}
</style>
