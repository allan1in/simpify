import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: true,
    loadMore: false,
    showFullScreenPlayer: false,
    showMessage: false,
    language: localStorage.getItem('language') || 'en',
    myLibWidth: 0,
    isCollasped: false
  }),
  actions: {
    setLanguage(language) {
      this.language = language

      localStorage.setItem('language', language)
    }
  }
})
