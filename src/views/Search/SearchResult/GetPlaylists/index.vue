<template>
  <main v-if="!loading" class="album-container">
    <div class="album-container__content">
      <TitleSimple :title="'Playlists'">
        <template #before-title>{{
          playlists.total === 1000 ? '999+' : playlists.total + ' '
        }}</template>
      </TitleSimple>
      <div class="album-container__content__results">
        <PlaylistCard v-for="item in playlists.items" :key="item.id" :item="item" />
      </div>
    </div>
  </main>
  <Loading :loading />
</template>

<script>
import { searchPlaylists } from '@/api/search'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import TitleSimple from '@/components/TitleSimple/index.vue'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'GetPlaylists',
  data() {
    return {
      playlists: {},
      loading: true
    }
  },
  components: {
    PlaylistCard,
    TitleSimple,
    Loading
  },
  methods: {
    async getPlaylists() {
      const params = {
        q: this.$route.params.inputContent,
        limit: 28,
        offset: 0
      }
      const res = (await searchPlaylists(params)).data.playlists
      this.playlists = res
      this.loading = false
    }
  },
  mounted() {
    this.getPlaylists()
  }
}
</script>

<style lang="scss" scoped>
.album-container {
  min-height: inherit;

  &__content {
    padding: 2.4rem;

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
