<template>
  <template v-if="!loading_skeleton">
    <section class="top-bar-container">
      <TagButton
        v-if="showTags.all"
        @handle-click="getAll"
        :text="$t('top_bar.all')"
        :isActive="!isActive"
      />
      <template v-for="tag in tags" :key="tag">
        <TagButton
          v-if="showTags[tag]"
          @handle-click="jumpTo(tag)"
          :text="$t(`top_bar.${tag}`)"
          :isActive="isActive === tag"
        />
      </template>
    </section>
  </template>
  <template v-else>
    <section class="top-bar-container">
      <Skeleton v-for="i in tags.length + 1" :key="i" class="skeleton" />
    </section>
  </template>
</template>

<script>
import { search } from '@/api/meta/search'
import Skeleton from '@/components/Skeleton/index.vue'
import { useAppStore } from '@/stores/app'
import { debounce } from '@/utils/debounce'
import { mapWritableState } from 'pinia'
import TagButton from '@/components/TagButton/index.vue'

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
    Skeleton,
    TagButton
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
    async $route(to, from) {
      this.loading = false
      this.loading_skeleton = true
      await this.debouncedCheck()
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
  height: 3.2rem;
  border-radius: 9999rem;
}

.top-bar-container {
  position: sticky;
  top: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1.2rem;
  padding: 1.2rem 0;
  padding-left: $gutter-4x;
  background-color: $color-bg-2;
  border-top-left-radius: $gutter;
  border-top-right-radius: $gutter;
}
</style>
