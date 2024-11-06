<template>
  <div class="artist-all-appears-on" v-if="!loading">
    <TitleShowAll :title="'Appears On'" />
    <div class="artist-all-appears-on__results">
      <AlbumCard v-for="item in appearsOn" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { getAppearsOn, getNextAppearsOn } from '@/api/meta/artist'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'ArtistAllApearsOn',
  components: {
    AlbumCard,
    TitleShowAll,
    AlbumCard
  },
  data() {
    return {
      id: this.$route.params.artistId,
      appearsOn: [],
      appearsOn_limit: 48,
      appearsOn_offset: 0,
      appearsOn_next: '',
      loadingMore: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    async getAll() {
      await this.getAppearsOn()

      this.loading = false
    },
    async getAppearsOn() {
      if (!this.loadingMore && this.appearsOn_next !== null) {
        this.loadingMore = true
        let res

        if (this.appearsOn_next === '') {
          const params = {
            limit: this.appearsOn_limit,
            offset: this.appearsOn_offset
          }
          res = (await getAppearsOn(this.id, params))
        } else {
          let path = this.appearsOn_next
          res = (await getNextAppearsOn(this.id, path.slice(path.indexOf('?') + 1)))
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.appearsOn))
        this.appearsOn = [...oldVals, ...newVals]
        this.appearsOn_next = res.next

        this.loadingMore = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getAppearsOn()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.artist-all-appears-on {
  padding: 1.6rem;

  &__results {
    @include gridCards;
  }
}
</style>
