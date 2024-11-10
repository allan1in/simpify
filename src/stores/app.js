import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: true,
    loadMore: false,
    showFullScreenPlayer: false,
    showMessage: false
  })
})
