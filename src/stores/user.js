import { defineStore } from 'pinia'
import settings from '@/settings'
import { getCurrentUserProfile } from '@/api/meta/user'
import { getToken, refreshToken } from '@/api/auth/index'

const { clientId, redirectUrl } = settings

export const useUserStore = defineStore('user', {
  state: () => ({
    display_name: '',
    avatar: '',
    uid: '',
    product: '',
    access_token: localStorage.getItem('access_token') || '',
    country: ''
  }),
  actions: {
    async login(code) {
      const code_verifier = localStorage.getItem('code_verifier')

      // Request tokens
      const response = await getToken({
        client_id: clientId,
        code: code,
        redirect_uri: redirectUrl,
        // Prove the client identity via code_verifier
        code_verifier: code_verifier
      })

      const { access_token, refresh_token } = response

      // Save to localStorage
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      this.access_token = access_token
    },
    async getUserData() {
      const res = await getCurrentUserProfile()

      this.avatar = res.images.length !== 0 ? res.images[0].url : ''
      this.display_name = res.display_name
      this.uid = res.id
      this.product = res.product
      this.country = res.country
    },
    logout() {
      window.localStorage.clear()
      window.location.reload()
    },
    async refreshToken() {
      const response = await refreshToken({
        client_id: clientId,
        refresh_token: localStorage.getItem('refresh_token')
      })

      const { access_token, refresh_token } = response

      // Save to localStorage
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      this.access_token = access_token
      console.log('Refresh token')
    },
    checkProduct(p) {
      return this.product === p
    }
  }
})
