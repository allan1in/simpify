<template>
  <template v-if="!loading_skeleton">
    <div class="artist-all-appears-on">
      <TitleShowAll :title="$t('artist.appears_on')" />
      <div class="artist-all-appears-on__results">
        <AlbumCard v-for="item in appearsOn" :key="item.id" :item="item" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="artist-all-appears-on">
      <TitleShowAll :loading="loading_skeleton" />
      <div class="artist-all-appears-on__results">
        <AlbumCard v-for="i in appearsOn_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </div>
  </template>
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
      loadingMore: false,
      loading_skeleton: true
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    async getAll() {
      await this.getAppearsOn()

      this.loading_skeleton = false
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
          res = await getAppearsOn(this.id, params)
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.appearsOn_next
          res = await getNextAppearsOn(this.id, path.slice(path.indexOf('?') + 1))
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
  },
  mounted() {
    this.loading = false
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
