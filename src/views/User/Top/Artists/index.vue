<template>
  <template v-if="!loading_skeleton">
    <main class="artists-container">
      <TitleShowAll :title="$t('profile.top_artists')" />
      <div class="artists-container__content">
        <CardArtist v-for="item in artists" :key="item.id" :item />
      </div>
    </main>
  </template>
  <template v-else>
    <main class="artists-container">
      <TitleShowAll :loading="loading_skeleton" />
      <div class="artists-container__content">
        <CardArtist v-for="i in artists_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </main>
  </template>
</template>
<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import CardArtist from '@/components/CardArtist/index.vue'
import { getUserTopArtists } from '@/api/meta/user'

export default {
  name: 'GetArtistsForUser',
  components: {
    TitleShowAll,
    CardArtist
  },
  data() {
    return {
      artists: [],
      artists_limit: 48,
      loading_skeleton: true
    }
  },
  methods: {
    async getAll() {
      await this.getArtists()

      this.loading_skeleton = false
    },
    async getArtists() {
      let params = {
        limit: this.artists_limit,
        offset: 0
      }
      const res = await getUserTopArtists(params)
      this.artists = res.items
    }
  },
  created() {
    this.getAll()
  }
}
</script>
<style lang="scss" scoped>
.artists-container {
  padding: $gutter-1-5x;

  &__content {
    @include gridCards;
  }
}
</style>
