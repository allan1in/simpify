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

export default {
  name: 'GetPlaylists',
  inject: ['bottom'],
  data() {
    return {
      playlists: [],
      playlists_limit: 48,
      playlists_offset: 0,
      playlists_next: '',
      loading_skeleton: true,
      loading_more: false
    }
  },
  components: {
    PlaylistCard
  },
  methods: {
    async getAll() {
      await this.getPlaylists()

      this.loading_skeleton = false
    },
    async getPlaylists() {
      if (!this.loading_more && this.playlists_next != null) {
        this.loading_more = true
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

        let newVals = res.items.filter((item) => item !== null)
        let oldVals = JSON.parse(JSON.stringify(this.playlists))

        this.playlists = [...oldVals, ...newVals]
        this.playlists_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal) {
      if (newVal <= 0) {
        this.getPlaylists()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.album-container {
  min-height: inherit;

  &__content {
    padding: $gutter-1-5x;

    &__msg {
      padding-bottom: $gutter-1-5x;
    }

    &__results {
      @include gridCards;
    }
  }
}
</style>
