<template>
  <main v-if="!loading" class="artist-container">
    <div class="artist-container__content">
      <div class="artist-container__content__results">
        <ArtistCard v-for="item in artists" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
</template>

<script>
import ArtistCard from '@/components/CardArtist/index.vue'
import { searchArtists, searchNextPage } from '@/api/meta/search'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'GetArtists',
  components: {
    ArtistCard
  },
  data() {
    return {
      artists: [],
      artists_limit: 28,
      artists_offset: 0,
      artists_next: '',
      loadingMore: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getArtists()
      this.loading = false
    },
    async getArtists() {
      if (!this.loadingMore && this.artists_next != null) {
        this.loadingMore = true
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

        this.loadingMore = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getArtists()
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
