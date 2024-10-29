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
    access_token: localStorage.getItem('access_token') || ''
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

      const { access_token, refresh_token, expires_in } = response

      // Save to localStorage
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      this.access_token = access_token
      // localStorage.setItem('expires_in', expires_in)
      // const now = new Date()
      // const expiry = new Date(now.getTime() + expires_in * 1000)
      // localStorage.setItem('expires', expiry)
    },
    async getUserData() {
      const res = await getCurrentUserProfile()

      this.avatar = res.images.length !== 0 ? res.images[0].url : ''
      this.display_name = res.display_name
      this.uid = res.id
    },
    logout() {
      window.localStorage.clear()
      window.location.reload()
    },
    async refreshToken() {
      const response = await refreshToken({
        client_id: clientId
      })

      const { access_token, refresh_token, expires_in } = response

      // Save to localStorage
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('expires_in', expires_in)
      const now = new Date()
      const expiry = new Date(now.getTime() + expires_in * 1000)
      localStorage.setItem('expires', expiry)
    }
  }
})
