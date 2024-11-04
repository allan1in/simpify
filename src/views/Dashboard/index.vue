<template>
  <div class="dashboard-container" v-if="!loading">
    <div class="dashboard-container__featured-playlists" v-if="playlists.length !== 0">
      <TitleShowAll
        :router-name="playlists_total > playlists_limit ? 'FeaturedPlaylists' : ''"
        title="Featured Playlists"
      />
      <div class="dashboard-container__featured-playlists__content">
        <CardHorizontal v-for="item in playlists" :item="item" />
      </div>
    </div>

    <div class="dashboard-container__new-releases" v-if="albums.length !== 0">
      <TitleShowAll title="New Releases" />
      <div class="dashboard-container__new-releases__content">
        <CardAlbum v-for="item in albums" :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import Container from '@/components/Container/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import CardAlbum from '@/components/CardAlbum/index.vue'
import CardHorizontal from '@/components/CardHorizontal/index.vue'
import { getFeaturedPlaylists } from '@/api/meta/browse'
import { getNewReleases, getNextNewReleases } from '@/api/meta/album'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Dashboard',
  components: {
    Container,
    PlaylistCard,
    TitleShowAll,
    CardAlbum,
    CardHorizontal
  },
  data() {
    return {
      playlists: [],
      playlists_total: 0,
      playlists_limit: 8,
      albums: [],
      albums_limit: 24,
      albums_offset: 0,
      albums_next: '',
      loading_more: false
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading', 'loadMore'])
  },
  methods: {
    async getAll() {
      await this.getPlaylists()
      await this.getNewReleases()

      this.loading = false
    },
    async getPlaylists() {
      const params = {
        limit: this.playlists_limit,
        offset: 0
      }
      const res = (await getFeaturedPlaylists(params)).playlists
      this.playlists = res.items
      this.playlists_total = res.total
    },
    async getNewReleases() {
      if (!this.loading_more && this.albums_next !== null) {
        this.loading_more = true
        let res

        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await getNewReleases(params)).albums
        } else {
          let path = this.albums_next
          res = (await getNextNewReleases(path.slice(path.indexOf('?') + 1))).albums
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))
        this.albums = [...oldVals, ...newVals]

        this.albums_next = res.next
        this.loadMore = false
      }
      this.loading_more = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        this.getNewReleases()
      }
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 1.6rem;
  background: linear-gradient(to bottom, $color-bg-6 0rem, transparent 50rem);

  &__featured-playlists {
    &__content {
      padding: 1.6rem;
      gap: $gutter-2x;

      @include gridCardsLess;
    }
  }

  &__new-releases {
    &__content {
      @include gridCards;
    }
  }
}
</style>
