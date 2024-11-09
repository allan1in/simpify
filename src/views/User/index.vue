<template>
  <template v-if="!loading_skeleton">
    <div class="user-container">
      <div class="user-container__banner">
        <Banner
          type="Profile"
          :title="profile.display_name"
          :images="profile.images"
          imgShape="circle"
        >
          <span class="user-container__banner__details__playlists" v-if="playlists_total">
            {{
              `${Intl.NumberFormat().format(playlists_total)} Public ${
                playlists_total > 1 ? ' Playlists' : 'Playlist'
              }`
            }}
          </span>
          <span class="user-container__banner__details__followers" v-if="profile.followers.total">
            {{
              profile.followers.total === 0
                ? ''
                : ` • ${
                    Intl.NumberFormat().format(profile.followers.total) +
                    (profile.followers.total > 1 ? ' Followers' : ' Follower')
                  }`
            }}
          </span>
        </Banner>
      </div>
      <div class="user-container__content">
        <div
          class="user-container__content__top-artists"
          v-if="this.uid === id && artists.length !== 0"
        >
          <TitleShowAll
            title="Top artists this month"
            :router-name="this.artists_total > this.artists_limit ? 'GetArtistsForUser' : ''"
          />
          <div class="user-container__content__top-artists__content">
            <CardArtist v-for="item in artists" :key="item.id" :item="item" />
          </div>
        </div>
        <div
          class="user-container__content__top-songs"
          v-if="this.uid === id && tracks.length !== 0"
        >
          <TitleShowAll
            title="Top tracks this month"
            :router-name="this.tracks_total > this.tracks_limit ? 'GetTracksForUser' : ''"
          />
          <div class="user-container__content__top-songs__content">
            <CardTrack
              v-for="(item, index) in tracks"
              :key="item.id"
              :item="item"
              :index
              :uris="uris"
            />
          </div>
        </div>
        <div class="user-container__content__playlists" v-if="playlists.length !== 0">
          <TitleShowAll
            title="Public Playlists"
            :router-name="this.playlists_total > this.playlists_limit ? 'UserPlaylists' : ''"
          />
          <div class="user-container__content__playlists__content">
            <CardPlaylist v-for="item in playlists" :key="item.id" :item="item" />
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="user-container">
      <div class="user-container__banner">
        <Banner :loading="loading_skeleton" imgShape="circle" />
      </div>
      <div class="user-container__content">
        <div class="user-container__content__top-artists" v-if="this.uid === id">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="user-container__content__top-artists__content">
            <CardArtist v-for="i in artists_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="user-container__content__top-songs" v-if="this.uid === id">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="user-container__content__top-songs__content">
            <CardTrack v-for="i in tracks_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
        <div class="user-container__content__playlists">
          <TitleShowAll :loading="loading_skeleton" />
          <div class="user-container__content__playlists__content">
            <CardPlaylist v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import {
  getUserPlaylists,
  getUserProfile,
  getUserTopArtists,
  getUserTopSongs
} from '@/api/meta/user'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import IconDefaultUser from '@/components/Icons/IconDefaultUser.vue'
import { mapState, mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import CardArtist from '@/components/CardArtist/index.vue'
import CardTrack from '@/components/CardTrack/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'
import Banner from '@/components/Banner/index.vue'

export default {
  name: 'User',
  components: {
    TitleShowAll,
    IconDefaultUser,
    CardArtist,
    CardTrack,
    CardPlaylist,
    Banner
  },
  data() {
    return {
      id: this.$route.params.userId,
      profile: {},
      artists: [],
      artists_limit: 8,
      artists_total: 0,
      tracks: [],
      tracks_limit: 4,
      tracks_total: 0,
      playlists: [],
      playlists_limit: 8,
      playlists_total: 0,
      loading_skeleton: true
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loading']),
    ...mapState(useUserStore, ['uid']),
    uris() {
      let uris = []
      this.tracks.forEach((item) => {
        uris.push(item.uri)
      })
      return uris
    }
  },
  methods: {
    async getAll() {
      await this.getProfile()
      await this.getUserTopArtists()
      await this.getUserTopTracks()
      await this.getPlaylists()

      this.loading_skeleton = false
    },
    async getProfile() {
      const res = await getUserProfile(this.$route.params.userId)
      this.profile = res
    },
    async getUserTopArtists() {
      const params = {
        time_range: 'short_term',
        limit: this.artists_limit,
        offset: 0
      }
      const res = await getUserTopArtists(params)
      this.artists = res.items
      this.artists_total = res.total
    },
    async getUserTopTracks() {
      const params = {
        time_range: 'short_term',
        limit: this.tracks_limit,
        offset: 0
      }
      const res = await getUserTopSongs(params)
      this.tracks = res.items
      this.tracks_total = res.total
    },
    async getPlaylists() {
      const params = {
        limit: this.playlists_limit,
        offset: this.playlists_offset
      }
      const res = await getUserPlaylists(this.id, params)
      this.playlists = res.items
      this.playlists_total = res.total
    }
  },
  watch: {
    $route: {
      async handler(to, from) {
        this.id = this.$route.params.userId
        this.loading = false
        this.loading_skeleton = true
        await this.getAll()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  &__content {
    padding: $gutter-2x;

    &__top-artists,
    &__playlists {
      padding-top: $gutter-2x;

      &__content {
        @include gridCards;
      }
    }

    &__top-songs {
      padding-top: $gutter-2x;

      &__content {
        padding-top: $gutter;
      }
    }
  }
}
</style>
