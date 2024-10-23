<template>
  <main v-if="!loading" class="artist-container">
    <div class="artist-container__content">
      <div class="artist-container__content__results">
        <ArtistCard v-for="item in artists" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import ArtistCard from '@/components/CardArtist/index.vue'
import { searchArtists, searchNextPage } from '@/api/search'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetArtists',
  components: {
    ArtistCard,
    Loading
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
  data() {
    return {
      artists: [],
      loading: true,
      artists_limit: 28,
      artists_offset: 0,
      artists_next: ''
    }
  },
  methods: {
    async getArtists() {
      if (this.artists_next != null) {
        let res

        if (this.artists_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.artists_limit,
            offset: this.artists_offset
          }
          res = (await searchArtists(params)).data.artists
        } else {
          let path = this.artists_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).data.artists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.artists))

        this.artists = [...oldVals, ...newVals]
        this.artists_next = res.next

        this.$emit('loadMoreFinish', false)
        this.loading = false
      }
    }
  },
  created() {
    this.getArtists()
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getArtists()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
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
