<template>
  <template v-if="!loading_skeleton">
    <div class="dashboard-container">
      <div class="dashboard-container__recent-play" v-if="tracks.length !== 0">
        <div class="dashboard-container__recent-play__background" :style="backgroundStyle"></div>
        <TitleShowAll
          class="dashboard-container__recent-play__title"
          :title="$t('home.recent-play')"
        />
        <div class="dashboard-container__recent-play__content">
          <CardTrackHorizontal
            @mouseenter="changeColor(item)"
            v-for="item in tracks"
            :key="item.id"
            :item="item"
          />
        </div>
      </div>
      <div class="dashboard-container__new-releases" v-if="albums.length !== 0">
        <TitleShowAll :title="$t('home.new_releases')" />
        <div class="dashboard-container__new-releases__content">
          <CardAlbum v-for="item in albums" :key="item.id" :item="item" />
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="dashboard-container">
      <div class="dashboard-container__recent-play">
        <TitleShowAll :loading="loading_skeleton" />
        <div class="dashboard-container__recent-play__content">
          <CardTrackHorizontal v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>
      <div class="dashboard-container__new-releases">
        <TitleShowAll :loading="loading_skeleton" />
        <div class="dashboard-container__new-releases__content">
          <CardAlbum v-for="i in albums_limit" :key="i" :loading="loading_skeleton" />
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import CardAlbum from '@/components/CardAlbum/index.vue'
import { getNewReleases, getNextNewReleases } from '@/api/meta/album'
import CardTrackHorizontal from '@/components/CardTrackHorizontal/index.vue'
import { getNextRecentlyPlayedTracks, getRecentlyPlayedTracks } from '@/api/meta/track'
import { getAverageColor } from '@/utils/average_color'

export default {
  name: 'Dashboard',
  inject: ['bottom'],
  components: {
    TitleShowAll,
    CardAlbum,
    CardTrackHorizontal
  },
  computed: {
    backgroundStyle() {
      return { 'background-color': this.color }
    }
  },
  data() {
    return {
      playlists: [],
      playlists_total: 0,
      playlists_limit: 8,
      albums: [],
      albums_limit: 48,
      albums_offset: 0,
      albums_next: '',
      loading_skeleton: true,
      loading_more: false,
      tracks: [],
      days: 7,
      tracks_limit: 8,
      color: undefined
    }
  },
  methods: {
    async getAll() {
      await Promise.all([this.getNewReleases(), this.getRecentlyPlayedTracks()])

      this.loading_skeleton = false
    },
    async getNewReleases() {
      if (!this.loading_more && this.albums_next !== null) {
        this.loading_more = true
        let res

        // First time load data
        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = (await getNewReleases(params)).albums
        } else {
          if (this.loading_skeleton) {
            return
          }
          let path = this.albums_next
          res = (await getNextNewReleases(path.slice(path.indexOf('?') + 1))).albums
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.albums))
        this.albums = [...oldVals, ...newVals]

        this.albums_next = res.next

        this.loading_more = false
      }
    },
    async getRecentlyPlayedTracks() {
      const timeStap = Date.now()
      let params = {
        limit: this.tracks_limit,
        before: timeStap
      }
      let moreSongsNeeded = true
      let next = undefined
      const res = await getRecentlyPlayedTracks(params)
      this.tracks = res.items
      this.removeDuplicates()

      if (this.tracks.length === this.tracks_limit) {
        moreSongsNeeded = false
      } else {
        next = res.next.slice(res.next.indexOf('?') + 1)
      }
      while (moreSongsNeeded) {
        const res = await getNextRecentlyPlayedTracks(next)
        next = res.next?.slice(res.next.indexOf('?') + 1)
        this.tracks = this.tracks.concat(res.items)
        this.removeDuplicates()

        if (this.tracks.length === this.tracks_limit || res.items.length === 0) {
          moreSongsNeeded = false
        }
      }
    },
    async changeColor(item) {
      try {
        let obj = await getAverageColor(item?.track?.album?.images?.[0]?.url)
        this.color = `rgba(${obj.r}, ${obj.g}, ${obj.b}, 0.6)`
      } catch (e) {
        /* empty */
      }
    },
    removeDuplicates() {
      this.tracks = this.tracks
        .filter(
          (value, index, self) => index === self.findIndex((t) => t.track.id === value.track.id)
        )
        .slice(0, this.tracks_limit)
    }
  },
  watch: {
    bottom(newVal) {
      if (newVal <= 0) {
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
  padding: $gutter-1-5x;
  position: relative;

  &__recent-play {
    height: max-content;

    &__background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 18rem;
      background-image: linear-gradient(to bottom, rgba($color-bg-2, 0.1), $color-bg-2);
      z-index: -1;

      @include transitionExtraSlow;
    }

    &__title {
      position: relative;
      z-index: 100;
    }

    &__content {
      padding: $gutter-1-5x;
      gap: $gutter-1-5x;

      @include gridCardsExtraLess;
    }
  }

  &__new-releases {
    &__content {
      @include gridCards;
    }
  }
}
</style>
