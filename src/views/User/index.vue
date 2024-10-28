<template>
  <div class="user-container" v-if="!loading">
    <div class="user-container__cover">
      <div class="user-container__cover__img-wrapper">
        <img
          v-if="profile.images[0]"
          class="user-container__cover__img-wrapper__img"
          :src="profile.images[0].url"
          :alt="profile.display_name"
        />
        <div v-else class="user-container__cover__img-wrapper__icon-wrapper">
          <IconDefaultUser />
        </div>
      </div>
      <div class="user-container__cover__info">
        <span class="user-container__cover__info__type">{{
          `${profile.type.charAt(0).toUpperCase()}${profile.type.slice(1)}`
        }}</span>
        <h1 class="user-container__cover__info__title">{{ profile.display_name }}</h1>
        <div class="user-container__cover__info__details">
          <span class="user-container__cover__info__details__playlists">
            {{
              `${Intl.NumberFormat().format(playlists_total)} Public ${profile.followers.total > 1 ? ' Playlists' : ' Playlist'}`
            }}
          </span>
          <span class="user-container__cover__info__details__followers">
            {{
              profile.followers.total === 0
                ? ''
                : ` • ${
                    Intl.NumberFormat().format(profile.followers.total) +
                    (profile.followers.total > 1 ? ' follower' : ' followers')
                  }`
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="user-container__content" v-if="playlists.length !== 0">
      <TitleShowAll title="Public Playlists" />
      <div class="user-container__content__playlists">
        <PlaylistCard v-for="item in playlists" :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
import { getUserPlaylists, getUserProfile, getNextUserPlaylists } from '@/api/meta/user'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import IconDefaultUser from '@/components/Icons/IconDefaultUser.vue'
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'User',
  components: {
    TitleShowAll,
    PlaylistCard,
    IconDefaultUser
  },
  data() {
    return {
      id: this.$route.params.userId,
      profile: {},
      playlists: [],
      playlists_next: '',
      playlists_limit: 32,
      playlists_offset: 0,
      playlists_total: 0
    }
  },
  computed: {
    ...mapWritableState(useAppStore, ['loadMore', 'loading'])
  },
  methods: {
    async getAll() {
      await this.getProfile()
      await this.getPlaylists()

      this.loading = false
    },
    async getProfile() {
      const res = await getUserProfile(this.$route.params.userId)
      this.profile = res
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
          res = await getUserPlaylists(this.id, params)
        } else {
          let path = this.playlists_next
          res = await getNextUserPlaylists(this.id, path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]
        this.playlists_next = res.next
        this.playlists_total = res.total

        this.loading_more = false
      }
      this.loadMore = false
    }
  },
  watch: {
    loadMore(newVal, oldVal) {
      if (newVal) {
        console.log('new')
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
.user-container {
  &__cover {
    padding: $gutter-4x;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    display: flex;
    align-items: end;
    justify-content: start;
    gap: $gutter-4x;

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

      &__img {
        max-height: 100%;
        object-fit: cover;
      }

      &__icon-wrapper {
        height: 6.4rem;
        width: 6.4rem;
        fill: $color-bg-7;
      }
    }

    &__info {
      &__type {
        font-size: 1.4rem;
      }

      &__title {
        font-family: $font-family-title;
        font-size: 9.6rem;
        font-weight: 800;

        @include oneLineEllipsis;
      }

      &__details {
        margin-top: 1rem;
        font-size: 1.4rem;
        color: $color-font-secondary;
      }
    }
  }

  &__content {
    padding: $gutter-2x;

    &__playlists {
      @include gridCards;
    }
  }
}
</style>
