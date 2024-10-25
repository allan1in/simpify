import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    showFullScreenPlayer: false,
    volume: 50,
    isShuffle: false,
    isPause: false,
    isRepeat: false,
    isMute: false
  })
})
