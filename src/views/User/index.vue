<template>
  <Container :loading @load-more="getPlaylists">
    <div class="user-container">
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
              {{ `${Intl.NumberFormat().format(playlists_total)} Public Playlists` }}
            </span>
            <span class="user-container__cover__info__details__followers">
              {{
                profile.followers.total === 0
                  ? ''
                  : ` • ${
                      Intl.NumberFormat().format(profile.followers.total) +
                      (profile.followers.total === '1' ? ' follower' : ' followers')
                    }`
              }}
            </span>
          </div>
        </div>
      </div>
      <div class="user-container__content">
        <TitleShowAll title="Public Playlists" />
        <div class="user-container__content__playlists">
          <PlaylistCard v-for="item in playlists" :item="item" />
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import { getUserPlaylists, getUserProfile, getNextUserPlaylists } from '@/api/user'
import Container from '@/components/Container/index.vue'
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import PlaylistCard from '@/components/CardPlaylist/index.vue'
import IconDefaultUser from '@/components/Icons/IconDefaultUser.vue'

export default {
  name: 'User',
  components: {
    Container,
    TitleShowAll,
    PlaylistCard,
    IconDefaultUser
  },
  data() {
    return {
      id:this.$route.params.userId,
      profile: {},
      playlists: [],
      loading: true,
      playlists_loadMore: false,
      playlists_next:'',
      playlists_limit: 28,
      playlists_offset: 0,
      playlists_total: 0,
    }
  },
  methods: {
    async getAll() {
      await this.getProfile()
      await this.getPlaylists()
      this.loading = false
    },
    async getProfile() {
      const res = (await getUserProfile(this.$route.params.userId)).data
      this.profile = res
    },
    async getPlaylists() {
      if (!this.playlists_loadMore && this.playlists_next !== null) {
        let res
        this.playlists_loadMore = true

        if (this.playlists_next === '') {
          const params = {
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = (await getUserPlaylists(this.id, params)).data
        } else {
          let path = this.playlists_next
          res = (await getNextUserPlaylists(this.id, path.slice(path.indexOf('?') + 1))).data
        }

        let newVals = res.items
        let oldVals = JSON.parse(JSON.stringify(this.playlists))
        this.playlists = [...oldVals, ...newVals]
        this.playlists_next = res.next
        this.playlists_total = res.total

        this.playlists_loadMore = false
      }
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
    padding: 2rem;
    background: linear-gradient(to bottom, $color-bg-6, $color-bg-5);
    display: flex;
    align-items: end;
    justify-content: start;
    gap: 2.5rem;

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
      background-color: $color-bg-4;

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
    padding: 2.4rem;

    &__playlists {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(14%, 100%), 1fr));
    }
  }
}
</style>
