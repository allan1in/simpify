import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    showFullScreenPlayer: false,
    volume: 75,
    isShuffle: false,
    isPause: true,
    isRepeat: false,
    isRepeatSingle: false,
    isMute: false
  })
})
