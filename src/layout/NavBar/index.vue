<template>
  <nav class="nav-bar">
    <div class="nav-bar__left">
      <router-link to="/" class="nav-bar__left__logo">
        <IconPrimaryLogo />
      </router-link>
    </div>
    <div class="nav-bar__mid-wrapper">
      <div class="nav-bar__mid-wrapper__mid">
        <button class="nav-bar__mid-wrapper__mid__home-btn" @click="toHome">
          <span class="nav-bar__mid-wrapper__mid__home-btn__wrapper" :class="{ 'btn-active': isHome }">
            <IconHomeActive v-if="isHome" />
            <IconHome v-else />
          </span>
        </button>
        <div class="nav-bar__mid-wrapper__mid__search">
          <input class="nav-bar__mid-wrapper__mid__search__input" type="text" placeholder="What do you want to play?"
            @click="toSearchPage" @focus="toSearchPage" @input="getSearchResult" v-model="inputContent" />
          <div class="nav-bar__mid-wrapper__mid__search__icon-wrapper">
            <IconSearch />
          </div>
          <button v-if="inputContent.length === 0" class="nav-bar__mid-wrapper__mid__search__btn-wrapper"
            :class="{ 'btn-active': isSearch }" @click="toSearchPage">
            <IconBrowseActive v-if="isSearch" />
            <IconBrowse v-else />
          </button>
          <button v-else
            class="nav-bar__mid-wrapper__mid__search__btn-wrapper nav-bar__mid-wrapper__mid__search__btn-wrapper__clear-border"
            @click="inputContent = ''">
            <IconClose />
          </button>
        </div>
      </div>
    </div>
    <DropDown class="nav-bar__right" top="5.6rem">
      <button class="nav-bar__right__photo-wrapper">
        <img class="nav-bar__right__photo-wrapper__photo" :src="avatar" :alt="display_name" :title="display_name" />
      </button>
      <template #dropDownItems>
        <DropDownItem
          toExternal="https://www.spotify.com/us/account/overview/?utm_source=spotify&utm_medium=menu&utm_campaign=your_account">
          Account</DropDownItem>
        <DropDownItem :to="{ name: 'User', params: { userId: uid } }">Profile</DropDownItem>
        <DropDownItem toExternal="https://www.spotify.com/us/premium/?ref=web_loggedin_upgrade_menu">Upgrade to Premium
        </DropDownItem>
        <DropDownItem :topLine="true" @click.prevent="logout">Log out</DropDownItem>
      </template>
    </DropDown>
  </nav>
</template>

<script>
import IconBrowse from '@/components/Icons/IconBrowse.vue'
import IconBrowseActive from '@/components/Icons/IconBrowseActive.vue'
import IconClose from '@/components/Icons/IconClose.vue'
import IconHome from '@/components/Icons/IconHome.vue'
import IconHomeActive from '@/components/Icons/IconHomeActive.vue'
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue'
import IconSearch from '@/components/Icons/IconSearch.vue'
import { useUserStore } from '@/stores/user'
import { mapActions, mapState } from 'pinia'
import DropDown from '@/components/DropDown/index.vue'
import DropDownItem from '@/components/DropDownItem/index.vue'

export default {
  name: 'NavBar',
  components: {
    IconPrimaryLogo,
    IconHome,
    IconHomeActive,
    IconSearch,
    IconBrowse,
    IconBrowseActive,
    IconClose,
    DropDown,
    DropDownItem
  },
  computed: {
    ...mapState(useUserStore, ['avatar', 'display_name', 'uid'])
  },
  data() {
    return {
      isHome: true,
      isSearch: false,
      inputContent: ''
    }
  },
  methods: {
    async toHome() {
      // Use await to prevent inputCount watcher from working before navigation
      await this.$router.push({ name: 'Dashboard' })
      this.inputContent = ''
    },
    toSearchPage() {
      if (this.$route.path.split('/')[1] !== 'search') {
        this.$router.push({ name: 'Search' })
      }
    },
    getSearchResult() {
      if (this.inputContent.length === 0) {
        this.$router.push({ name: 'Search' })
      } else {
        this.$router.push({
          name: 'SearchResult',
          params: { inputContent: this.inputContent }
        })
      }
    },
    ...mapActions(useUserStore, ['logout'])
  },
  watch: {
    // Set data values by route
    $route: {
      handler(to, from) {
        let path = to.path.split('/')

        if (to.name === 'Dashboard') {
          // Path: '/'
          this.isHome = true
          this.isSearch = false
        } else if (path[1] === 'search') {
          // Path: '/search/*'
          this.isHome = false
          this.isSearch = true

          if (
            to.params.inputContent !== undefined &&
            decodeURIComponent(path[2]) === to.params.inputContent
          ) {
            // Decode URI to prevent infinite calls between watcher $router and watcher inputContent
            this.inputContent = to.params.inputContent
          }
        } else {
          // Path: other paths
          this.isHome = false
          this.isSearch = false
          this.inputContent = ''
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-active:nth-child(n) {
  fill: $color-font-primary;
}

.nav-bar {
  height: $height-nav;
  margin-bottom: $gutter;
  display: flex;
  justify-content: space-between;
  position: relative;

  &__left {
    display: flex;
    align-items: center;
    z-index: 1;

    &__logo {
      display: block;
      height: calc($height-nav * 2 / 3);
      width: calc($height-nav * 2 / 3);
      fill: $color-font-primary;
      margin: 0 2rem;
    }

    @include respond(tab-port) {
      display: none;
    }
  }

  &__mid-wrapper {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;

    @include respond(tab-port) {
      position: relative;
      justify-content: start;
      margin-right: $gutter;
    }

    &__mid {
      display: flex;
      align-items: center;
      gap: $gutter;
      width: 53.7rem;

      @include respond(tab-port) {
        width: unset;
        flex-grow: 1;
        max-width: 53.7rem;
      }

      &__home-btn {
        width: $height-nav;
        height: $height-nav;
        border-radius: 50%;
        background-color: $color-bg-3;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover &__wrapper {
          fill: $color-font-primary;
        }

        @include clickAnimation;

        &__wrapper {
          fill: $color-font-secondary;
          height: calc($height-nav / 2);
          width: calc($height-nav / 2);
        }
      }

      &__search {
        position: relative;
        cursor: pointer;
        width: calc(100% - 5.6rem);

        &:hover &__input {
          background-color: $color-bg-5;
          box-shadow: inset 0 0 0 1px $color-bg-6;

          @include transition;
        }

        &:hover &__icon-wrapper {
          fill: $color-font-primary;
        }

        &__input {
          @include transition;

          width: 100%;
          height: $height-nav;
          background-color: $color-bg-3;
          color: $color-font-primary;
          padding: 1.2rem 6.4rem 1.2rem 4.8rem;
          border-radius: calc($height-nav / 2);
          font-size: 1.6rem;
          cursor: pointer;

          &::placeholder {
            color: $color-font-secondary;
          }

          &:nth-child(n):focus {
            background-color: $color-bg-3;
            box-shadow: inset 0 0 0 2px $color-font-primary;
            cursor: text;
          }

          &:focus+div {
            fill: $color-font-primary;
          }

        }

        &__icon-wrapper {
          position: absolute;
          top: 50%;
          left: 1.2rem;
          transform: translateY(-50%);
          fill: $color-font-secondary;
          height: calc($height-nav / 2);
          width: calc($height-nav / 2);
        }

        &__btn-wrapper {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0.6rem;
          fill: $color-font-secondary;
          box-sizing: content-box;
          height: calc($height-nav / 2);
          width: calc($height-nav / 2);
          padding: 0 1.2rem;
          border-left: 1px solid $color-font-secondary;

          &:hover {
            fill: $color-font-primary;

            & svg {
              @include clickAnimation;
            }
          }

          &__clear-border {
            border: none;
          }
        }
      }
    }
  }



  &__right {
    z-index: 1;

    &__photo-wrapper {
      height: $height-nav;
      width: $height-nav;
      border-radius: 50%;
      background-color: $color-bg-3;
      display: flex;
      justify-content: center;
      align-items: center;

      @include clickAnimation;

      &__photo {
        height: 65%;
        width: 65%;
        border-radius: 50%;
      }
    }
  }
}
</style>
