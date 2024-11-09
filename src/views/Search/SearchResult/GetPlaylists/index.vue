<template>
  <template v-if="!loading_skeleton">
    <main class="album-container">
      <div class="album-container__content">
        <div class="album-container__content__results">
          <PlaylistCard v-for="item in playlists" :key="item.id" :item="item" />
        </div>
      </div>
    </main>
  </template>
  <template v-else>
    <main class="album-container">
      <div class="album-container__content">
        <div class="album-container__content__results">
          <PlaylistCard v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>
    </main>
  </template>
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
      playlists_limit: 48,
      playlists_offset: 0,
      playlists_next: '',
      loadingMore: false,
      loading_skeleton: true
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

      this.loading_skeleton = false
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
          res = (await searchPlaylists(params)).playlists
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.playlists_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).playlists
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
  mounted() {
    this.loading = false
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
      @include gridCards;
    }
  }
}
</style>
