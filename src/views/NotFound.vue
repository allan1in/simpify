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
$color-font-primary-lighter: #a7a7a7;
.not-found-container {
  background-color: $color-bg-2;
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
      fill: $color-brand;
      margin-bottom: 4rem;
    }

    &__title {
      margin-bottom: 1.6rem;
      font-size: 4.8rem;
    }

    &__describe {
      margin-bottom: 4rem;
      color: $color-font-primary-lighter;
      font-size: 1.6rem;
    }

    &__home {
      background-color: $color-font-primary;
      color: $color-bg-1;
      font-size: 1.6rem;
      padding: 1.4rem 3.2rem;
      font-weight: bold;
      border-radius: 3rem;

      @include clickAnimation;
    }
  }
}
</style>
