<template>
  <Container :loading>
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
import { getFeaturedPlaylists } from '@/api/browse'

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
      playlists: {}
    }
  },
  methods: {
    async getPlaylists() {
      const params = {
        limit: 28,
        offset: 0
      }
      const res = (await getFeaturedPlaylists(params)).data.playlists.items
      this.playlists = res
      this.loading = false
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
