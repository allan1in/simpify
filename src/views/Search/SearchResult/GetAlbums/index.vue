<template>
  <template v-if="!loading_skeleton">
    <main class="album-container">
      <div class="album-container__content">
        <div class="album-container__content__results">
          <AlbumCard v-for="item in albums" :key="item.id" :item="item" />
        </div>
      </div>
    </main>
  </template>
  <template v-else>
    <main class="album-container">
      <div class="album-container__content">
        <div class="album-container__content__results">
          <AlbumCard v-for="i in albums_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>
    </main>
  </template>
</template>

<script>
import { searchAlbums, searchNextPage } from '@/api/meta/search'
import AlbumCard from '@/components/CardAlbum/index.vue'
import { useAppStore } from '@/stores/app'
import { mapWritableState } from 'pinia'

export default {
  name: 'GetAlbums',
  data() {
    return {
      albums: [],
      albums_limit: 48,
      albums_offset: 0,
      albums_next: '',
      loadingMore: false,
      loading_skeleton: true
    }
  },
  components: {
    AlbumCard
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getAlbums()

      this.loading_skeleton = false
    },
    async getAlbums() {
      if (!this.loadingMore && this.albums_next != null) {
        this.loadingMore = true
        let res

        if (this.albums_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await searchAlbums(params)).albums
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.albums_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).albums
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))

        this.albums = [...oldVals, ...newVals]
        this.albums_next = res.next

        this.loadingMore = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getAlbums()
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
