<template>
  <main v-if="!loading" class="album-container">
    <div class="album-container__content">
      <div class="album-container__content__results">
        <AlbumCard v-for="item in albums" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import { searchAlbums, searchNextPage } from '@/api/search'
import AlbumCard from '@/components/CardAlbum/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetAlbums',
  data() {
    return {
      albums: [],
      loading: true,
      albums_limit: 28,
      albums_offset: 0,
      albums_next: ''
    }
  },
  // https://danyal.dk/blog/2022/12/05/vuejs-3-emit-the-warning-extraneous-non-emits-event-listeners/
  emits: ['loadMoreFinish'],
  props: {
    loadMore: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  components: {
    AlbumCard,
    Loading
  },
  methods: {
    async getAlbums() {
      if (this.albums_next != null) {
        let res

        if (this.albums_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await searchAlbums(params)).data.albums
        } else {
          let path = this.albums_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).data.albums
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))

        this.albums = [...oldVals, ...newVals]
        this.albums_next = res.next

        this.$emit('loadMoreFinish', false)
        this.loading = false
      }
    }
  },
  created() {
    this.getAlbums()
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getAlbums()
      }
    }
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
