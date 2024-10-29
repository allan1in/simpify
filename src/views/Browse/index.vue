<template>
  <div class="browse-container" v-if="!loading">
    <div class="browse-container__cover">
      <h1 class="browse-container__cover__title">{{ category.name }}</h1>
    </div>
    <div class="browse-container__content">
      <PlaylistCard v-for="item in playlists" :item="item" />
    </div>
  </div>
</template>

<script>
import { getCategory, getCategoryPlaylists, getNextCategoryPlaylists } from '@/api/meta/browse.js'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  nmae: 'Browse',
  components: {
    PlaylistCard
  },
  data() {
    return {
      category: {},
      playlists: [],
      playlists_limit: 32,
      playlists_offset: 0,
      playlists_next: '',
      loading_more: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    async getAll() {
      await this.getCategory()
      await this.getPlaylists()
      this.loading = false
    },
    async getCategory() {
      const res = await getCategory(this.$route.params.categoryId)
      this.category = res
    },
    async getPlaylists() {
      if (!this.loading_more && this.playlists_next !== null) {
        this.loading_more = true
        let res

        if (this.playlists_next === '') {
          const params = {
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = (await getCategoryPlaylists(this.$route.params.categoryId, params)).playlists
        } else {
          let path = this.playlists_next
          res = (
            await getNextCategoryPlaylists(
              this.$route.params.categoryId,
              path.slice(path.indexOf('?') + 1)
            )
          ).playlists
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]

        this.playlists_next = res.next
        this.loading_more = false
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
$color-bg-cover: hsl(random(360), 40%, 50%);

.browse-container {
  &__cover {
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    padding: 4.8rem $gutter-4x;

    &__title {
      font-size: 8rem;
      font-weight: 800;
      font-family: $font-family-title;
      text-shadow: 0 0 20px rgba($color-bg-1, 1);

      @include respond(phone) {
        font-size: 4rem;
      }
    }
  }

  &__content {
    padding: 1.6rem;

    @include gridCards;
  }
}
</style>
