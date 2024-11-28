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

export default {
  name: 'GetAlbums',
  inject: ['bottom'],
  data() {
    return {
      albums: [],
      albums_limit: 48,
      albums_offset: 0,
      albums_next: '',
      loading_skeleton: true,
      loading_more: false
    }
  },
  components: {
    AlbumCard
  },
  methods: {
    async getAll() {
      await this.getAlbums()

      this.loading_skeleton = false
    },
    async getAlbums() {
      if (!this.loading_more && this.albums_next != null) {
        this.loading_more = true
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

        let newVals = res.items.filter((item) => item !== null)
        let oldVals = JSON.parse(JSON.stringify(this.albums))

        this.albums = [...oldVals, ...newVals]
        this.albums_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal, oldVal) {
      if (newVal <= 0) {
        this.getAlbums()
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
