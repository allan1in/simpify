<template>
  <template v-if="!loading_skeleton">
    <div class="browse-container">
      <div class="browse-container__cover">
        <h1 class="browse-container__cover__title">{{ category.name }}</h1>
      </div>
      <div class="browse-container__content">
        <PlaylistCard v-for="item in playlists" :key="item.id" :item="item" />
      </div>
    </div>
  </template>
  <template v-else>
    <div class="browse-container">
      <div class="browse-container__cover">
        <Skeleton class="skeleton" />
      </div>
      <div class="browse-container__content">
        <PlaylistCard v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </div>
  </template>
</template>

<script>
import { getCategory, getCategoryPlaylists, getNextCategoryPlaylists } from '@/api/meta/browse.js'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import { mapState, mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import Skeleton from '@/components/Skeleton/index.vue'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Browse',
  inject: ['bottom'],
  components: {
    PlaylistCard,
    Skeleton
  },
  data() {
    return {
      category: {},
      playlists: [],
      playlists_limit: 48,
      playlists_offset: 0,
      playlists_next: '',
      loading_skeleton: true,
      loading_more: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['language']),
    ...mapState(useUserStore, ['country'])
  },
  methods: {
    async getAll() {
      await this.getCategory()
      await this.getPlaylists()

      this.loading_skeleton = false
    },
    async getCategory() {
      const res = await getCategory(this.$route.params.categoryId, {
        locale: `${this.language}_${this.country}`
      })
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
    }
  },
  watch: {
    bottom(newVal, oldVal) {
      if (newVal <= 0) {
        this.getPlaylists()
      }
    },
    language(newVal, oldVal) {
      this.$router.go(0)
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
$color-bg-cover: hsl(random(360), 40%, 50%);

.skeleton {
  height: $font-size-title-large;
  width: 40%;
}

.browse-container {
  &__cover {
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    padding: 4.8rem $gutter-4x;

    &__title {
      font-size: $font-size-title-large;
      font-weight: 800;
      font-family: $font-family-title;
      text-shadow: 0 0 20px rgba($color-bg-1, 1);

      @include respondContainer(phone) {
        font-size: calc($font-size-title-large * 0.5);
      }
    }
  }

  &__content {
    padding: $gutter-1-5x;

    @include gridCards;
  }
}
</style>
