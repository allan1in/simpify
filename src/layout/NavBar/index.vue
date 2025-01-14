<template>
  <nav class="nav-bar">
    <div class="nav-bar__left">
      <div class="nav-bar__left__logo">
        <a
          v-tooltip="$t('tooltip.go_to_spotify')"
          href="https://open.spotify.com/"
          target="_blank"
          class="nav-bar__left__logo__icon"
        >
          <IconPrimaryLogo />
        </a>
      </div>
      <div class="nav-bar__left__arrow">
        <button
          v-tooltip="$t('tooltip.go_back')"
          class="nav-bar__left__arrow__left"
          @click="$router.go(-1)"
        >
          <IconArrowLeft />
        </button>
        <button
          v-tooltip="$t('tooltip.go_forward')"
          class="nav-bar__left__arrow__right"
          @click="$router.go(1)"
        >
          <IconArrowRight />
        </button>
      </div>
    </div>
    <div class="nav-bar__mid">
      <button v-tooltip="$t('tooltip.home')" class="nav-bar__mid__home-btn" @click="toHome">
        <span class="nav-bar__mid__home-btn__wrapper" :class="{ 'btn-active': isHome }">
          <IconHomeActive v-if="isHome" />
          <IconHome v-else />
        </span>
      </button>
      <div class="nav-bar__mid__search">
        <input
          class="nav-bar__mid__search__input"
          type="text"
          :placeholder="$t('nav_bar.input_message')"
          @input="getSearchResult"
          v-model="inputContent"
        />
        <div class="nav-bar__mid__search__icon-wrapper">
          <IconSearch />
        </div>
        <div class="nav-bar__mid__search__btn" v-if="inputContent.length !== 0">
          <button
            v-tooltip="$t('tooltip.clear_search')"
            class="nav-bar__mid__search__btn__btn-wrapper nav-bar__mid__search__btn__btn-wrapper__clear-border"
            @click="inputContent = ''"
          >
            <IconClose />
          </button>
        </div>
      </div>
    </div>
    <div class="nav-bar__right">
      <DropDown position="bottom-start" v-model="show_menu_language">
        <template #trigger>
          <div v-tooltip="$t('tooltip.language')" class="nav-bar__right__language">
            <button class="nav-bar__right__language__language-wrapper">
              <IconLanguage />
            </button>
          </div>
        </template>
        <template #dropDownItems>
          <DropDownItem @item-click="show_menu_language = false" @click="changeLocale('en')"
            >English</DropDownItem
          >
          <DropDownItem @item-click="show_menu_language = false" @click="changeLocale('zh')"
            >简体中文
          </DropDownItem>
        </template>
      </DropDown>
      <DropDown v-model="show_menu_me" position="bottom-end">
        <template #trigger>
          <button v-tooltip="display_name" class="nav-bar__right__photo-wrapper">
            <img
              v-if="avatar.length !== 0"
              class="nav-bar__right__photo-wrapper__photo"
              :src="avatar"
              :alt="display_name"
              :title="display_name"
            />
            <div v-else class="nav-bar__right__photo-wrapper__photo-default-wrapper">
              <span class="nav-bar__right__photo-wrapper__photo-default-wrapper__default">{{
                display_name.charAt(0).toLocaleUpperCase()
              }}</span>
            </div>
          </button>
        </template>
        <template #dropDownItems>
          <DropDownItem
            @item-click="show_menu_me = false"
            toExternal="https://www.spotify.com/us/account/overview/?utm_source=spotify&utm_medium=menu&utm_campaign=your_account"
          >
            {{ $t('user.account') }}</DropDownItem
          >
          <DropDownItem
            @item-click="show_menu_me = false"
            :to="{ name: 'User', params: { userId: uid } }"
            >{{ $t('user.profile') }}</DropDownItem
          >
          <DropDownItem
            @item-click="show_menu_me = false"
            toExternal="https://www.spotify.com/us/premium/?ref=web_loggedin_upgrade_menu"
            >{{ $t('user.upgrade') }}
          </DropDownItem>
          <DropDownItem
            @item-click="show_menu_me = false"
            :topLine="true"
            @click.prevent="logout"
            >{{ $t('user.log_out') }}</DropDownItem
          >
        </template>
      </DropDown>
    </div>
  </nav>
</template>

<script>
import IconClose from '@/components/Icons/IconClose.vue'
import IconHome from '@/components/Icons/IconHome.vue'
import IconHomeActive from '@/components/Icons/IconHomeActive.vue'
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue'
import IconSearch from '@/components/Icons/IconSearch.vue'
import { useUserStore } from '@/stores/user'
import { mapActions, mapState } from 'pinia'
import DropDown from '@/components/DropDown/index.vue'
import DropDownItem from '@/components/DropDownItem/index.vue'
import IconArrowRight from '@/components/Icons/IconArrowRight.vue'
import IconArrowLeft from '@/components/Icons/IconArrowLeft.vue'
import IconLanguage from '@/components/Icons/IconLanguage.vue'
import { useAppStore } from '@/stores/app'

export default {
  name: 'NavBar',
  components: {
    IconPrimaryLogo,
    IconHome,
    IconHomeActive,
    IconSearch,
    IconClose,
    DropDown,
    DropDownItem,
    IconArrowLeft,
    IconArrowRight,
    IconLanguage
  },
  computed: {
    ...mapState(useUserStore, ['avatar', 'display_name', 'uid'])
  },
  data() {
    return {
      isHome: true,
      isSearch: false,
      inputContent: '',
      show_menu_language: false,
      show_menu_me: false
    }
  },
  methods: {
    async toHome() {
      // Use await to prevent inputCount watcher from working before navigation
      await this.$router.push({ name: 'Home' })
      this.inputContent = ''
    },
    getSearchResult() {
      if (this.inputContent.trim().length !== 0) {
        this.$router.push({
          name: 'SearchResult',
          params: { inputContent: this.inputContent }
        })
      }
    },
    ...mapActions(useUserStore, ['logout']),
    ...mapActions(useAppStore, ['setLanguage']),
    changeLocale(language) {
      // https://vue-i18n.intlify.dev/guide/essentials/scope.html#locale-changing
      this.$i18n.locale = language
      this.setLanguage(language)
    }
  },
  watch: {
    // Set data values by route
    $route: {
      handler(to) {
        let path = to.path.split('/')

        if (to.name === 'Home') {
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
  display: flex;
  justify-content: space-between;
  position: relative;
  gap: $gutter-2x;

  &__left {
    flex: 1;
    display: flex;
    align-items: center;
    z-index: 1;
    justify-content: start;
    gap: $gutter;

    &__logo {
      height: 100%;
      display: flex;
      align-items: center;

      &__icon {
        display: block;
        height: $height-nav;
        width: calc($height-nav * 2 / 3);
        fill: $color-font-primary;
        margin: 0 2rem;
      }
    }

    &__arrow {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: $gutter;
      height: 100%;

      &__left,
      &__right {
        height: 100%;
        padding: calc($height-nav / 3) 0;
        width: calc($height-nav / 3);
        aspect-ratio: 1 / 1;
        fill: $color-font-secondary;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover,
        &:active {
          fill: $color-font-primary;
        }

        @include clickAnimation;
      }
    }
  }

  &__mid {
    flex: 5;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: $gutter;
    max-width: 53.7rem;

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
        width: 100%;
        height: $height-nav;
        background-color: $color-bg-3;
        color: $color-font-primary;
        padding: 1.2rem 6.4rem 1.2rem 4.8rem;
        border-radius: calc($height-nav / 2);
        font-size: 1.6rem;
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
        height: 100%;
        width: calc($height-nav / 2);
        aspect-ratio: 1 / 1;
      }

      &__btn {
        position: absolute;
        top: 0;
        right: 0.6rem;

        &__btn-wrapper {
          display: block;
          fill: $color-font-secondary;
          box-sizing: content-box;
          height: calc($height-nav / 2);
          width: calc($height-nav / 2);
          padding: 1.2rem;

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
    flex: 1;
    z-index: 1;
    display: flex;
    justify-content: end;
    align-items: center;
    gap: $gutter;
    height: 100%;

    &__language {
      height: $height-nav;
      width: $height-nav;
      display: flex;
      align-items: center;
      justify-content: center;

      &__language-wrapper {
        display: block;
        height: 50%;
        width: 50%;
        fill: $color-font-secondary;

        &:hover {
          fill: $color-font-primary;
        }

        @include clickAnimation;
      }
    }

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

        &-default-wrapper {
          height: 65%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: $color-brand;

          &__default {
            color: $color-bg-1;
            font-size: $font-size-text-primary;
          }
        }
      }
    }
  }
}
</style>
