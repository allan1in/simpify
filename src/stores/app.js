import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: true,
    show_fullscreen_player: false,
    language: localStorage.getItem('language') || 'en'
  }),
  actions: {
    setLanguage(language) {
      this.language = language

      localStorage.setItem('language', language)
    }
  }
})
