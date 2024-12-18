<template>
  <main class="login-container">
    <Loading :loading />
  </main>
</template>

<script>
import { getCodeChanllenge } from '@/utils/code_challenge_base64'
import { getCodeVerifier } from '@/utils/code_verifier'
import settings from '@/settings'
import { mapActions } from 'pinia'
import { useUserStore } from '@/stores/user'
import Loading from '@/components/Loading/index.vue'

export default {
  name: 'Login',
  components: {
    Loading
  },
  data() {
    return {
      loading: true
    }
  },
  methods: {
    async redirectToSpotifyAuthorize() {
      const { clientId, scope, redirectUrl, authorizationEndpoint } = settings

      // https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
      const code_verifier = getCodeVerifier()
      const code_challenge_base64 = await getCodeChanllenge(code_verifier)
      window.localStorage.setItem('code_verifier', code_verifier)

      // Constructing URL
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

      // Redirect the user to the authorization server for login
      window.location.href = authUrl.toString()
    },
    ...mapActions(useUserStore, ['login'])
  },
  async created() {
    // Check if authorization server response param exists
    let code = this.$route.query.code
    if (code) {
      await this.login(code)
      this.$router.push({ name: 'Home' })
    } else {
      this.redirectToSpotifyAuthorize()
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
        font-size: $font-size-text-primary;
        border-radius: 3.2rem;
        font-weight: bold;

        @include clickAnimation;
      }
    }
  }

  &__loading-wrapper {
    padding: 2.4rem;

    &__loading {
      font-size: 3.2rem;
    }
  }
}
</style>
