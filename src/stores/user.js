import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    access_token: localStorage.getItem('access_token') || null,
    refresh_token: localStorage.getItem('refresh_token') || null,
    refresh_in: localStorage.getItem('refresh_in') || null,
    expires: localStorage.getItem('expires') || null
  }),
  actions: {
    save(response) {
      const { access_token, refresh_token, expires_in } = response

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('expires_in', expires_in)

      const now = new Date()
      const expiry = new Date(now.getTime() + expires_in * 1000)
      localStorage.setItem('expires', expiry)
    }
  }
})
