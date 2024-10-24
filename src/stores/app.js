import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    showFullScreenPlayer: false,
    volume: 50,
    isShuffle: false,
    isPause: false,
    isRepeat: false,
    isMute: false
  }),
  actions: {
    toggleFullScreemPlayer() {
      this.showFullScreenPlayer = !this.showFullScreenPlayer
    },
    toggleShuffle() {
      this.isShuffle = !this.isShuffle
    },
    togglePause() {
      this.isPause = !this.isPause
    },
    toggleRepeat() {
      this.isRepeat = !this.isRepeat
    }
  }
})
