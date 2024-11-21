<template>
  <template v-if="!loading_skeleton">
    <div class="artist-all-singles">
      <TitleShowAll :title="$t('artist.singles')" />
      <div class="artist-all-singles__results">
        <AlbumCard v-for="item in singles" :key="item.id" :item="item" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="artist-all-singles">
      <TitleShowAll :loading="loading_skeleton" />
      <div class="artist-all-singles__results">
        <AlbumCard v-for="i in singles_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </div>
  </template>
</template>

<script>
import AlbumCard from '@/components/CardAlbum/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import { getSingles, getNextSingles } from '@/api/meta/artist'

export default {
  name: 'ArtistAllSingles',
  inject: ['bottom'],
  components: {
    AlbumCard,
    TitleShowAll,
    AlbumCard
  },
  data() {
    return {
      singles: [],
      id: this.$route.params.artistId,
      singles_limit: 48,
      singles_offset: 0,
      singles_next: '',
      loading_skeleton: true,
      loading_more: false
    }
  },
  methods: {
    async getAll() {
      await this.getSingles()

      this.loading_skeleton = false
    },
    async getSingles() {
      if (!this.loading_more && this.singles_next !== null) {
        this.loading_more = true
        let res

        if (this.singles_next === '') {
          const params = {
            limit: this.singles_limit,
            offset: this.singles_offset
          }
          res = await getSingles(this.id, params)
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.singles_next
          res = await getNextSingles(this.id, path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.singles))
        this.singles = [...oldVals, ...newVals]
        this.singles_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal, oldVal) {
      if (newVal <= 0) {
        this.getSingles()
      }
    }
  },
  created() {
    this.getAll()
  },
  mounted() {
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.artist-all-singles {
  padding: $gutter-1-5x;

  &__results {
    @include gridCards;
  }
}
</style>
