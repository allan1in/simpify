<template>
  <div class="user-container" v-if="!loading">
    <div class="user-container__cover">
      <div class="user-container__cover__img-wrapper">
        <img v-if="profile.images[0]" class="user-container__cover__img-wrapper__img" :src="profile.images[0].url"
          :alt="profile.display_name" />
        <div v-else class="user-container__cover__img-wrapper__icon-wrapper">
          <IconDefaultUser />
        </div>
      </div>
      <div class="user-container__cover__info">
        <span class="user-container__cover__info__type">Profile</span>
        <h1 class="user-container__cover__info__title" :title="profile.display_name">
          {{ profile.display_name }}
        </h1>
        <div class="user-container__cover__info__details">
          <span class="user-container__cover__info__details__playlists" v-if="playlists_total">
            {{
              `${Intl.NumberFormat().format(playlists_total)} Public ${playlists_total > 1 ? ' Playlists' : 'Playlist'
              }`
            }}
          </span>
          <span class="user-container__cover__info__details__followers" v-if="profile.followers.total">
            {{
              profile.followers.total === 0
                ? ''
                : ` • ${Intl.NumberFormat().format(profile.followers.total) +
                (profile.followers.total > 1 ? ' Followers' : ' Follower')
                }`
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="user-container__content">
      <div class="user-container__content__top-artists" v-if="this.uid === id && artists.length !== 0">
        <TitleShowAll title="Top artists this month"
          :router-name="this.artists_total > this.artists_limit ? 'GetArtistsForUser' : ''" />
        <div class="user-container__content__top-artists__content">
          <CardArtist v-for="item in artists" :item="item" />
        </div>
      </div>
      <div class="user-container__content__top-songs" v-if="this.uid === id && tracks.length !== 0">
        <TitleShowAll title="Top tracks this month"
          :router-name="this.tracks_total > this.tracks_limit ? 'GetTracksForUser' : ''" />
        <div class="user-container__content__top-songs__content">
          <CardTrack v-for="(item, index) in tracks" :item="item" :index :uris="uris" />
        </div>
      </div>
      <div class="user-container__content__playlists" v-if="playlists.length !== 0">
        <TitleShowAll title="Public Playlists"
          :router-name="this.playlists_total > this.playlists_limit ? 'UserPlaylists' : ''" />
        <div class="user-container__content__playlists__content">
          <CardPlaylist v-for="item in playlists" :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserPlaylists, getUserProfile, getUserTopArtists, getUserTopSongs } from '@/api/meta/user'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import IconDefaultUser from '@/components/Icons/IconDefaultUser.vue'
import { mapState, mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import CardArtist from '@/components/CardArtist/index.vue'
import CardTrack from '@/components/CardTrack/index.vue'
import CardPlaylist from '@/components/CardPlaylist/index.vue'

export default {
  name: 'User',
  components: {
    TitleShowAll,
    IconDefaultUser,
    CardArtist,
    CardTrack,
    CardPlaylist
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

      this.loading = false
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
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  &__cover {
    padding: $gutter-4x;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    display: flex;
    align-items: end;
    justify-content: start;
    gap: $gutter-4x;

    @include respond(phone) {
      flex-direction: column;
      align-items: center;
    }

    &__img-wrapper {
      flex-shrink: 0;
      overflow: hidden;
      height: 22rem;
      width: 22rem;
      border-radius: 50%;
      box-shadow: 0 0 20px 20px rgba($color-bg-3, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $color-bg-3;

      @include respond(phone) {
        height: unset;
        width: 60%;
        aspect-ratio: 1 / 1;
      }

      &__img {
        max-height: 100%;
        object-fit: cover;
      }

      &__icon-wrapper {
        height: 30%;
        aspect-ratio: 1 / 1;
        fill: $color-bg-7;
      }
    }

    &__info {
      &__type {
        font-size: 1.4rem;
      }

      &__title {
        font-family: $font-family-title;
        font-size: $font-size-title-large;
        font-weight: 800;

        @include oneLineEllipsis;

        @include respond(phone) {
          font-size: 3.2rem;
        }
      }

      &__details {
        font-size: 1.4rem;
        color: $color-font-secondary;
      }
    }
  }

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
