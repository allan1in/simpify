<template>
  <nav class="nav-bar">
    <div class="nav-bar__left">
      <router-link to="/" class="nav-bar__left__logo">
        <IconPrimaryLogo />
      </router-link>
    </div>
    <div class="nav-bar__mid-wrapper">
      <div class="nav-bar__mid">
        <button class="nav-bar__mid__home-btn" @click="toHome">
          <span class="nav-bar__mid__home-btn__wrapper" :class="{ 'btn-active': isHome }">
            <IconHomeActive v-if="isHome" />
            <IconHome v-else />
          </span>
        </button>
        <div class="nav-bar__mid__search">
          <input
            class="nav-bar__mid__search__input"
            type="text"
            placeholder="What do you want to play?"
            @click="toSearch"
            v-model="inputContent"
          />
          <div class="nav-bar__mid__search__icon-wrapper">
            <IconSearch />
          </div>
          <button
            class="nav-bar__mid__search__btn-wrapper"
            :class="{ 'btn-active': isSearch }"
            @click="toSearch"
          >
            <IconBrowseActive v-if="isSearch" />
            <IconBrowse v-else />
          </button>
        </div>
      </div>
    </div>
    <div class="nav-bar__right">
      <button class="nav-bar__right__photo-wrapper">
        <img
          class="nav-bar__right__photo-wrapper__photo"
          :src="avatar"
          :alt="display_name"
          :title="display_name"
        />
      </button>
    </div>
  </nav>
</template>

<script>
import IconBrowse from '@/components/Icons/IconBrowse.vue'
import IconBrowseActive from '@/components/Icons/IconBrowseActive.vue'
import IconHome from '@/components/Icons/IconHome.vue'
import IconHomeActive from '@/components/Icons/IconHomeActive.vue'
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue'
import IconSearch from '@/components/Icons/IconSearch.vue'
import { useUserStore } from '@/stores/user'
import { mapState } from 'pinia'

export default {
  name: 'NavBar',
  components: {
    IconPrimaryLogo,
    IconHome,
    IconHomeActive,
    IconSearch,
    IconBrowse,
    IconBrowseActive
  },
  computed: {
    ...mapState(useUserStore, ['avatar', 'display_name'])
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
    toSearch() {
      if (this.inputContent.length === 0) {
        this.$router.push({ name: 'Search' })
      }
    }
  },
  watch: {
    // Set data values by route
    $route: {
      handler(to, from) {
        let path = to.path.split('/')
        if (path[1] === '') {
          this.isHome = true
          this.isSearch = false
        } else if (path[1] === 'search') {
          this.isHome = false
          this.isSearch = true
          if (path[2] !== undefined && path.length == 3) {
            // Decode URI to prevent infinite calls between watcher $router and watcher inputContent
            this.inputContent = decodeURIComponent(path[2])
          }
        }
      },
      immediate: true
    },
    // Show different pages by input content
    inputContent(newVal, oldVal) {
      // Only works when the path is '/search/*'
      if (this.$route.path.split('/')[1] !== 'search') {
        return
      }
      if (newVal.length === 0) {
        this.$router.push({ name: 'Search' })
      } else {
        this.$router.push({ name: 'SearchResult', params: { content: newVal } })
      }
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
  }

  &__mid-wrapper {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__mid {
    display: flex;
    align-items: center;
    gap: $gutter;

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

      &:hover &__input {
        background-color: $color-bg-5;
        box-shadow: inset 0 0 0 1px $color-bg-6;

        @include transition;
      }

      &:hover &__icon-wrapper {
        fill: $color-font-primary;
      }

      &__input {
        height: $height-nav;
        background-color: $color-bg-3;
        color: $color-font-primary;
        padding: 1.2rem 6.4rem 1.2rem 4.8rem;
        border-radius: calc($height-nav / 2);
        font-size: 1.6rem;
        width: 47.4rem;
        cursor: pointer;

        @include transition;

        &::placeholder {
          color: $color-font-secondary;
        }

        &:nth-child(n):focus {
          background-color: $color-bg-3;
          box-shadow: inset 0 0 0 2px $color-font-primary;
          cursor: text;
        }

        &:focus + div {
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
