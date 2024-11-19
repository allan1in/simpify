<template>
  <template v-if="!loading_skeleton">
    <main class="playlists-container">
      <TitleShowAll title="Public Playlists" />
      <div class="playlists-container__content">
        <CardPlaylist v-for="item in playlists" :key="item.id" :item />
      </div>
    </main>
  </template>
  <template v-else>
    <main class="playlists-container">
      <TitleShowAll :loading="loading_skeleton" />
      <div class="playlists-container__content">
        <CardPlaylist v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </main>
  </template>
</template>
<script>
import { useAppStore } from '@/stores/app'
import { mapWritableState } from 'pinia'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'
import { getNextUserPlaylists, getUserPlaylists } from '@/api/meta/user'

export default {
  name: 'GetPlaylistsForUser',
  components: {
    TitleShowAll,
    CardPlaylist
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  data() {
    return {
      id: this.$route.params.userId,
      playlists: [],
      playlists_next: '',
      playlists_limit: 40,
      playlists_offset: 0,
      playlists_total: 0,
      loading_more: false,
      loading_skeleton: true
    }
  },
  methods: {
    async getAll() {
      await this.getPlaylists()

      this.loading_skeleton = false
    },
    async getPlaylists() {
      if (!this.loading_more && this.playlists_next !== null) {
        this.loading_more = true
        let res

        if (this.playlists_next === '') {
          const params = {
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = await getUserPlaylists(this.id, params)
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.playlists_next
          res = await getNextUserPlaylists(this.id, path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]
        this.playlists_next = res.next
        this.playlists_total = res.total

        this.loading_more = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getPlaylists()
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
.playlists-container {
  padding: $gutter-1-5x;

  &__content {
    @include gridCards;
  }
}
</style>
