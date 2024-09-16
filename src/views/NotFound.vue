<template>
  <main class="not-found-container">
    <div class="not-found-container__box">
      <div class="not-found-container__box__icon-wrapper">
        <IconPrimaryLogo />
      </div>
      <h1 class="not-found-container__box__title">找不到页面</h1>
      <p class="not-found-container__box__describe">我们似乎找不到你要查找的页面。</p>
      <router-link to="/" class="not-found-container__box__home">主页</router-link>
    </div>
  </main>
</template>
<script>
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue'

export default {
  name: 'NotFound',
  components: {
    IconPrimaryLogo
  }
}
</script>
<style lang="scss" scoped>
$font-color-lighter: #a7a7a7;
.not-found-container {
  background-color: $bg-main-color-light;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  &__box {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__icon-wrapper {
      height: 6rem;
      width: 6rem;
      fill: $font-color-active;
      margin-bottom: 4rem;
    }

    &__title {
      margin-bottom: 1.6rem;
      font-size: 4.8rem;
    }

    &__describe {
      margin-bottom: 4rem;
      color: $font-color-lighter;
      font-size: 1.6rem;
    }

    &__home {
      background-color: $font-color;
      color: $bg-main-color;
      font-size: 1.6rem;
      padding: 1.4rem 3.2rem;
      font-weight: bold;
      border-radius: 3rem;

      &:hover {
        transform: scale(1.04);
      }
    }
  }
}
</style>
