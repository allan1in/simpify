<template>
  <template v-if="!loading_skeleton">
    <main class="artist-container">
      <div class="artist-container__content">
        <div class="artist-container__content__results">
          <ArtistCard v-for="item in artists" :key="item.id" :item="item" />
        </div>
      </div>
    </main>
  </template>
  <template v-else>
    <main class="artist-container">
      <div class="artist-container__content">
        <div class="artist-container__content__results">
          <ArtistCard v-for="i in artists_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>
    </main>
  </template>
</template>

<script>
import ArtistCard from '@/components/CardArtist/index.vue'
import { searchArtists, searchNextPage } from '@/api/meta/search'

export default {
  name: 'GetArtists',
  inject: ['bottom'],
  components: {
    ArtistCard
  },
  data() {
    return {
      artists: [],
      artists_limit: 48,
      artists_offset: 0,
      artists_next: '',
      loading_skeleton: true,
      loading_more: false
    }
  },
  methods: {
    async getAll() {
      await this.getArtists()

      this.loading_skeleton = false
    },
    async getArtists() {
      if (!this.loading_more && this.artists_next != null) {
        this.loading_more = true
        let res

        if (this.artists_next === '') {
          const params = {
            q: this.$route.params.inputContent,
            limit: this.artists_limit,
            offset: this.artists_offset
          }
          res = (await searchArtists(params)).artists
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.artists_next
          res = (await searchNextPage(path.slice(path.indexOf('?') + 1))).artists
        }

        let newVals = res.items.filter((item) => item !== null)
        let oldVals = JSON.parse(JSON.stringify(this.artists))

        this.artists = [...oldVals, ...newVals]
        this.artists_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom(newVal) {
      if (newVal <= 0) {
        this.getArtists()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.artist-container {
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
