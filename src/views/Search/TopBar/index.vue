<template>
  <section class="top-bar-container">
    <TagButton @handle-click="getAll" :text="$t('top_bar.all')" :active-tag="!isActive" />
    <template v-for="tag in tags" :key="tag">
      <TagButton @handle-click="jumpTo(tag)" :text="$t(`top_bar.${tag}`)" :active-tag="isActive === tag" />
    </template>
  </section>
</template>

<script>
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
    TagButton
  },
  methods: {
    getAll() {
      this.$router.push({ name: 'SearchResult' })
    },
    jumpTo(tag) {
      this.$router.push({ name: `Get${tag.charAt(0).toUpperCase()}${tag.slice(1)}` })
    }
  },
  watch: {
    $route: {
      handler() {
        this.isActive = decodeURIComponent(
          this.$route.fullPath.split('/')[3] ? this.$route.fullPath.split('/')[3] : ''
        )
      },
      immediate: true
    }
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
  padding-left: $gutter-3x;
  background-color: $color-bg-2;
  border-top-left-radius: $gutter;
  border-top-right-radius: $gutter;
}
</style>
