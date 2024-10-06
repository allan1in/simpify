<template>
  <main class="login-container">
    <div class="login-container__box">
      <div class="login-container__box__logo-wrapper">
        <IconPrimaryLogo class="login-container__box__logo-wrapper__logo" />
      </div>
      <div class="login-container__box__title-wrapper">
        <h1 class="login-container__box__title-wrapper__title">登录到 Spotify</h1>
      </div>
      <div class="login-container__box__btn-wrapper">
        <button
          class="login-container__box__btn-wrapper__login-btn"
          @click="redirectToSpotifyAuthorize"
        >
          登录
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import IconPrimaryLogo from '@/components/Icons/IconPrimaryLogo.vue'
import { getCodeChanllenge } from '@/utils/code_challenge_base64'
import { getCodeVerifier } from '@/utils/code_verifier'
import settings from '@/settings'
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'

export default {
  name: 'Login',
  components: {
    IconPrimaryLogo
  },
  methods: {
    async redirectToSpotifyAuthorize() {
      const { clientId, scope, redirectUrl, authorizationEndpoint } = settings

      // https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
      const code_verifier = getCodeVerifier()

      const code_challenge_base64 = await getCodeChanllenge(code_verifier)

      window.localStorage.setItem('code_verifier', code_verifier)

      const authUrl = new URL(authorizationEndpoint)
      const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: code_challenge_base64,
        redirect_uri: redirectUrl
      }

      authUrl.search = new URLSearchParams(params).toString()
      window.location.href = authUrl.toString() // Redirect the user to the authorization server for login
    },
    ...mapActions(useUserStore, ['getToken'])
  },
  async created() {
    let code = this.$route.query.code
    if (code) {
      await this.getToken(code)
      this.$router.push({ name: 'Dashboard' })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient($color-bg-5, $color-bg-1);
  padding: 3.2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &__box {
    width: 100%;
    max-width: 73.4rem;
    background-color: $color-bg-2;
    border-radius: $border-radius-default;

    &__logo-wrapper {
      display: flex;
      justify-content: center;
      padding: 3.2rem 0 0.8rem;

      &__logo {
        height: 3.6rem;
        width: 3.6rem;
        fill: $color-font-primary;
      }
    }

    &__title-wrapper {
      display: flex;
      justify-content: center;

      &__title {
        font-size: 3.2rem;
        font-family: $font-family-title;
      }
    }

    &__btn-wrapper {
      display: flex;
      justify-content: center;

      &__login-btn {
        margin: 3rem 0;
        background-color: $color-brand;
        padding: 0.8rem 3.2rem;
        color: $color-bg-1;
        text-align: center;
        font-size: 1.6rem;
        border-radius: 3.2rem;
        font-weight: bold;

        @include clickAnimation;
      }
    }
  }
}
</style>
