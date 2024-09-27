import { defineStore } from 'pinia'

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
    save(response) {
      const { access_token, refresh_token, expires_in } = response

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('expires_in', expires_in)

      const now = new Date()
      const expiry = new Date(now.getTime() + expires_in * 1000)
      localStorage.setItem('expires', expiry)

      this.access_token = access_token
      this.refresh_token = refresh_token
      this.refresh_in = expires_in
      this.expires = expiry
    },
    async getUserData() {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + this.access_token }
      })

      let res = await response.json()

      this.avatar = res.images[0].url
      this.display_name = res.display_name
    }
  }
})
