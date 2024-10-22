<template>
  <Container :loading @load-more="getPlaylists">
    <div class="featured-playlists-container">
      <TitleSimple title="Featured Playlists" />
      <div class="featured-playlists-container__content">
        <CardPlaylist v-for="item in playlists" :item="item" />
      </div>
    </div>
  </Container>
</template>

<script>
import Container from '@/components/Container/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'
import { getFeaturedPlaylists, getNextFeaturedPlaylists } from '@/api/browse'

export default {
  name: 'FeaturedPlaylists',
  components: {
    Container,
    TitleSimple,
    CardPlaylist
  },
  data() {
    return {
      loading: true,
      playlists: [],
      limit: 28,
      offset: 0,
      next: '',
      loadMore: false
    }
  },
  methods: {
    async getPlaylists() {
      if (!this.loadMore && this.next !== null) {
        let res
        this.loadMore = true

        if (this.next === '') {
          const params = {
            limit: this.limit,
            offset: this.offset
          }
          res = (await getFeaturedPlaylists(params)).data.playlists
        } else {
          let path = this.next
          res = (await getNextFeaturedPlaylists(path.slice(path.indexOf('?') + 1))).data.playlists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]

        this.next = res.next
        this.offset = res.offset + res.limit

        this.loadMore = false
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
    grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
  }
}
</style>
