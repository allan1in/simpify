<template>
  <Container :loading @load-more="getPlaylists">
    <div class="featured-playlists-container">
      <TitleShowAll title="Featured Playlists" />
      <div class="featured-playlists-container__content">
        <CardPlaylist v-for="item in playlists" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'
import { getFeaturedPlaylists, getNextFeaturedPlaylists } from '@/api/browse'

export default {
  name: 'FeaturedPlaylists',
  components: {
    Container,
    TitleShowAll,
    CardPlaylist
  },
  data() {
    return {
      loading: true,
      playlists: [],
      playlists_limit: 28,
      playlists_offset: 0,
      playlists_next: '',
      playlists_loadMore: false
    }
  },
  methods: {
    async getPlaylists() {
      if (!this.playlists_loadMore && this.playlists_next !== null) {
        let res
        this.playlists_loadMore = true

        if (this.playlists_next === '') {
          const params = {
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = (await getFeaturedPlaylists(params)).data.playlists
        } else {
          let path = this.playlists_next
          res = (await getNextFeaturedPlaylists(path.slice(path.indexOf('?') + 1))).data.playlists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]

        this.playlists_next = res.next

        this.playlists_loadMore = false
        this.loading = false
      }
    }
  },
  created() {
    this.getPlaylists()
  }
}
</script>

<style lang="scss" scoped>
.featured-playlists-container {
  padding: 1.6rem;

  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
  }
}
</style>
