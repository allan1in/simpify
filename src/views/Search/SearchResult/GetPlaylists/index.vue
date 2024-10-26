<template>
  <main v-if="!loading" class="album-container">
    <div class="album-container__content">
      <div class="album-container__content__results">
        <PlaylistCard v-for="item in playlists" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
</template>

<script>
import { searchPlaylists, searchNextPage } from '@/api/meta/search'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import { useAppStore } from '@/stores/app'
import { mapWritableState } from 'pinia'

export default {
  name: 'GetPlaylists',
  data() {
    return {
      playlists: [],
      playlists_limit: 28,
      playlists_offset: 0,
      playlists_next: '',
      loadingMore: false
    }
  },
  components: {
    PlaylistCard
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    async getAll() {
      await this.getPlaylists()
      this.loading = false
    },
    async getPlaylists() {
      if (!this.loadingMore && this.playlists_next != null) {
        this.loadingMore = true
        let res

        if (this.playlists_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = (await searchPlaylists(params)).data.playlists
        } else {
          let path = this.playlists_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).data.playlists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))

        this.playlists = [...oldVals, ...newVals]
        this.playlists_next = res.next

        this.loadingMore = false
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
  beforeUnmount() {
    this.loading = true
  }
}
</script>

<style lang="scss" scoped>
.album-container {
  min-height: inherit;

  &__content {
    padding: 1.6rem;

    &__msg {
      padding-bottom: 1.6rem;
    }

    &__results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
    }
  }
}
</style>
