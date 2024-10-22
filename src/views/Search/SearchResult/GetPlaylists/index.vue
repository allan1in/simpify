<template>
  <main v-if="!loading" class="album-container">
    <div class="album-container__content">
      <div class="album-container__content__results">
        <PlaylistCard v-for="item in playlists" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import { searchPlaylists, searchNextPage } from '@/api/search'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetPlaylists',
  data() {
    return {
      playlists: [],
      loading: true,
      limit: 28,
      offset: 0,
      next: ''
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
  props: {
    loadMore: {
      type: Boolean,
      require: true
    }
  },
  components: {
    PlaylistCard,
    Loading
  },
  methods: {
    async getPlaylists() {
      if (this.next != null) {
        let res

        if (this.next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.limit,
            offset: this.offset
          }
          res = (await searchPlaylists(params)).data.playlists
        } else {
          let path = this.next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).data.playlists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))

        this.playlists = [...oldVals, ...newVals]
        this.next = res.next
        this.offset = res.limit + res.offset

        this.$emit('loadMoreFinish', false)
        this.loading = false
      }
    }
  },
  created() {
    this.getPlaylists()
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getPlaylists()
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
      grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));
    }
  }
}
</style>
