<template>
  <template v-if="!loading_skeleton">
    <section class="top-bar-container">
      <button
        v-if="showTags.all"
        class="top-bar-container__btn"
        :class="{ 'btn-active': !isActive }"
        @click="getAll"
      >
        All
      </button>
      <template v-for="tag in tags">
        <button
          v-if="showTags[tag]"
          class="top-bar-container__btn"
          :class="{ 'btn-active': isActive === tag }"
          @click="jumpTo(tag)"
        >
          {{ `${tag.charAt(0).toUpperCase()}${tag.slice(1)}` }}
        </button>
      </template>
    </section>
  </template>
  <template v-else>
    <section class="top-bar-container">
      <Skeleton v-for="i in tags.length + 1" class="skeleton" />
    </section>
  </template>
</template>

<script>
import { search } from '@/api/meta/search'
import Skeleton from '@/components/Skeleton/index.vue'
import { useAppStore } from '@/stores/app'
import { debounce } from '@/utils/debounce'
import { mapWritableState } from 'pinia'

export default {
  name: 'TopBar',
  data() {
    return {
      isActive: undefined,
      showTags: {},
      loading_skeleton: true,
      tags: ['tracks', 'artists', 'albums', 'playlists']
    }
  },
  components: {
    Skeleton
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading'])
  },
  methods: {
    getAll() {
      this.$router.push({ name: 'SearchResult' })
    },
    jumpTo(tag) {
      this.$router.push({ name: `Get${tag.charAt(0).toUpperCase()}${tag.slice(1)}` })
    },
    debouncedCheck() {},
    // If there is no data of this type, hide the tag
    async checkHasResults() {
      if (this.$route.params.inputContent) {
        let type = this.tags
          .map((tag) => {
            return tag.slice(0, tag.length - 1)
          })
          .join(',')
        const params = {
          q: this.$route.params.inputContent,
          type: type,
          limit: 1,
          offset: 0
        }
        const res = await search(params)

        this.tags.forEach((tag) => {
          this.showTags[tag] = res[tag]?.total === 0 ? false : true
        })

        Object.keys(this.showTags).forEach((key) => {
          if (this.showTags[key]) {
            this.showTags.all = true
          }
        })

        this.loading_skeleton = false
      }
    }
  },
  watch: {
    $route(to, from) {
      this.loading = false
      this.loading_skeleton = true
      this.debouncedCheck()
      this.isActive = decodeURIComponent(
        this.$route.fullPath.split('/')[3] ? this.$route.fullPath.split('/')[3] : ''
      )
    }
  },
  async created() {
    this.loading = false
    this.debouncedCheck = debounce(this.checkHasResults)
    await this.debouncedCheck()
    this.isActive = decodeURIComponent(
      this.$route.fullPath.split('/')[3] ? this.$route.fullPath.split('/')[3] : ''
    )
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  width: 6.4rem;
  height: 100%;
  border-radius: 9999rem;
}

.btn-active:nth-child(n) {
  background-color: $color-font-primary;
  color: $color-bg-1;

  &:hover {
    background-color: $color-font-primary;
  }
}

.top-bar-container {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1.2rem;
  padding: 1.2rem 0;
  padding-left: $gutter-4x;
  background-color: $color-bg-2;
  border-top-left-radius: $gutter;
  border-top-right-radius: $gutter;
  height: $height-nav-secondary;

  &__btn {
    background-color: $color-bg-5;
    color: $color-font-primary;
    padding: 0.4rem 1.2rem;
    height: 100%;
    border-radius: 9999rem;
    font-size: $font-size-text-secondary;

    &:hover {
      background-color: $color-bg-6;
    }
  }
}
</style>
