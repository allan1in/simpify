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

export default {
  name: 'ArtistAllApearsOn',
  inject: ['bottom'],
  components: {
    AlbumCard,
    TitleShowAll
  },
  data() {
    return {
      id: this.$route.params.artistId,
      appearsOn: [],
      appearsOn_limit: 48,
      appearsOn_offset: 0,
      appearsOn_next: '',
      loading_skeleton: true,
      loading_more: false
    }
  },
  methods: {
    async getAll() {
      await this.getAppearsOn()

      this.loading_skeleton = false
    },
    async getAppearsOn() {
      if (!this.loading_more && this.appearsOn_next !== null) {
        this.loading_more = true
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

        let newVals = res.items.filter((item) => item !== null)
        let oldVals = JSON.parse(JSON.stringify(this.appearsOn))
        this.appearsOn = [...oldVals, ...newVals]
        this.appearsOn_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal) {
      if (newVal <= 0) {
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
  padding: $gutter-1-5x;

  &__results {
    @include gridCards;
  }
}
</style>
