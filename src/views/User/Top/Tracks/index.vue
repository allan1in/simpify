<template>
  <template v-if="!loading_skeleton">
    <main class="tracks-container">
      <TitleShowAll :title="$t('profile.top_tracks')" />
      <div class="tracks-container__content">
        <HeaderTrackList />
        <CardTrack v-for="(item, index) in tracks" :key="item.id" :item :index :uris="uris" />
      </div>
    </main>
  </template>
  <template v-else>
    <main class="tracks-container">
      <TitleShowAll :loading="loading_skeleton" />
      <div class="tracks-container__content">
        <HeaderTrackList :loading="loading_skeleton" />
        <CardTrack v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </main>
  </template>
</template>
<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import HeaderTrackList from '@/components/HeaderTrackList/index.vue'
import CardTrack from '@/components/CardTrack/index.vue'
import { getUserTopSongs } from '@/api/meta/user'

export default {
  name: 'GetTracksForUser',
  components: {
    TitleShowAll,
    HeaderTrackList,
    CardTrack
  },
  computed: {
    uris() {
      let uris = []
      this.tracks.forEach((item) => {
        uris.push(item.uri)
      })
      return uris
    }
  },
  data() {
    return {
      tracks: [],
      tracks_limit: 50,
      loading_skeleton: true
    }
  },
  methods: {
    async getAll() {
      await this.getTracks()

      this.loading_skeleton = false
    },
    async getTracks() {
      let params = {
        limit: this.tracks_limit,
        offset: 0
      }
      const res = await getUserTopSongs(params)
      this.tracks = res.items
    }
  },
  created() {
    this.getAll()
  }
}
</script>
<style lang="scss" scoped>
.tracks-container {
  padding: $gutter-1-5x;
}
</style>
