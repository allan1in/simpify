import { defineStore } from 'pinia'
import settings from '@/settings'
import { getCurrentUserProfile } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    access_token: localStorage.getItem('access_token') || null,
    refresh_token: localStorage.getItem('refresh_token') || null,
    refresh_in: localStorage.getItem('refresh_in') || null,
    expires: localStorage.getItem('expires') || null,
    display_name: '',
    avatar: ''
  }),
  actions: {
    async getToken(code) {
      const { clientId, redirectUrl, tokenEndpoint } = settings
      const code_verifier = localStorage.getItem('code_verifier')

      let response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUrl,
          // Prove the client identity via code_verifier
          code_verifier: code_verifier
        })
      })

      response = await response.json()

      const { access_token, refresh_token, expires_in } = response

      // Save to localStorage
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('expires_in', expires_in)
      const now = new Date()
      const expiry = new Date(now.getTime() + expires_in * 1000)
      localStorage.setItem('expires', expiry)

      // Save to userStore
      this.access_token = access_token
      this.refresh_token = refresh_token
      this.refresh_in = expires_in
      this.expires = expiry
    },
    async getUserData() {
      const res = (await getCurrentUserProfile()).data

      this.avatar = res.images[0].url
      this.display_name = res.display_name
    }
  }
})
