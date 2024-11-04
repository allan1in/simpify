<template>
  <div class="artist-all-singles" v-if="!loading">
    <TitleShowAll :title="'Singles'" />
    <div class="artist-all-singles__results">
      <AlbumCard v-for="item in singles" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { getSingles, getNextSingles } from '@/api/meta/artist'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'ArtistAllSingles',
  components: {
    AlbumCard,
    TitleShowAll,
    AlbumCard
  },
  data() {
    return {
      singles: [],
      id: this.$route.params.artistId,
      singles_limit: 32,
      singles_offset: 0,
      singles_next: '',
      loadingMore: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    async getAll() {
      await this.getSingles()

      this.loading = false
    },
    async getSingles() {
      if (!this.loadingMore && this.singles_next !== null) {
        this.loadingMore = true
        let res

        if (this.singles_next === '') {
          const params = {
            limit: this.singles_limit,
            offset: this.singles_offset
          }
          res = (await getSingles(this.id, params))
        } else {
          let path = this.singles_next
          res = (await getNextSingles(this.id, path.slice(path.indexOf('?') + 1)))
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.singles))
        this.singles = [...oldVals, ...newVals]
        this.singles_next = res.next

        this.loadingMore = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getSingles()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.artist-all-singles {
  padding: 1.6rem;

  &__results {
    @include gridCards;
  }
}
</style>
