<template>
  <nav class="nav-bar">
    <div class="nav-bar__left">
      <router-link to="/" class="nav-bar__left__logo">
        <IconPrimaryLogo />
      </router-link>
    </div>
    <div class="nav-bar__mid-wrapper">
      <div class="nav-bar__mid">
        <button class="nav-bar__mid__home-btn" @click="isHome = true">
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
            @click="isHome = false"
          />
          <div class="nav-bar__mid__search__icon-wrapper">
            <IconSearch />
          </div>
          <button
            class="nav-bar__mid__search__btn-wrapper"
            :class="{ 'btn-active': !isHome }"
            @click="isHome = false"
          >
            <IconBrowseActive v-if="!isHome" />
            <IconBrowse v-else />
          </button>
        </div>
      </div>
    </div>
    <div class="nav-bar__right">
      <button class="nav-bar__right__photo-wrapper">
        <img class="nav-bar__right__photo-wrapper__photo" :src="photo" alt="" />
      </button>
    </div>
  </nav>
</template>

<script>
import photo from '@/assets/photo.jfif'
import IconBrowse from '@/components/Icons/IconBrowse.vue'
import IconBrowseActive from '@/components/Icons/IconBrowseActive.vue'
import IconHome from '@/components/Icons/IconHome.vue'
import IconHomeActive from '@/components/Icons/IconHomeActive.vue'
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue'
import IconSearch from '@/components/Icons/IconSearch.vue'

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
  data() {
    return {
      photo,
      isHome: true
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-active:nth-child(n) {
  fill: $font-color;
}

.nav-bar {
  height: $nav-height;
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
      height: calc($nav-height * 2 / 3);
      width: calc($nav-height * 2 / 3);
      fill: $font-color;
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
      width: $nav-height;
      height: $nav-height;
      border-radius: 50%;
      background-color: $bg-nav-color;
      display: flex;
      justify-content: center;
      align-items: center;

      &:hover &__wrapper {
        fill: $font-color;
      }

      &__wrapper {
        fill: $font-color-light;
        height: calc($nav-height / 2);
        width: calc($nav-height / 2);
      }
    }

    &__search {
      position: relative;
      cursor: pointer;

      &:hover &__input {
        background-color: $bg-input-hover-color;
      }

      &:hover &__icon-wrapper {
        fill: $font-color;
      }

      &__input {
        height: $nav-height;
        background-color: $bg-nav-color;
        color: $font-color;
        padding: 1.2rem 6.4rem 1.2rem 4.8rem;
        border-radius: calc($nav-height / 2);
        font-size: 1.6rem;
        width: 47.4rem;
        cursor: pointer;

        &::placeholder {
          color: $font-color-light;
        }

        &:focus {
          box-shadow: inset 0 0 0 2px $font-color;
          cursor: text;
        }

        &:focus + div {
          fill: $font-color;
        }
      }

      &__icon-wrapper {
        position: absolute;
        top: 50%;
        left: 1.2rem;
        transform: translateY(-50%);
        fill: $font-color-light;
        height: calc($nav-height / 2);
        width: calc($nav-height / 2);
      }

      &__btn-wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0.6rem;
        fill: $font-color-light;
        box-sizing: content-box;
        height: calc($nav-height / 2);
        width: calc($nav-height / 2);
        padding: 0 1.2rem;
        border-left: 1px solid $font-color-light;

        &:hover {
          fill: $font-color;

          & svg {
            transform: scale(1.04);
          }
        }
      }
    }
  }

  &__right {
    z-index: 1;

    &__photo-wrapper {
      height: $nav-height;
      width: $nav-height;
      border-radius: 50%;
      background-color: $bg-nav-color;
      display: flex;
      justify-content: center;
      align-items: center;

      &__photo {
        height: 65%;
        width: 65%;
        border-radius: 50%;
      }
    }
  }
}
</style>
