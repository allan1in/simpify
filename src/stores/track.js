import { defineStore } from 'pinia'

export const useTrackStore = defineStore('track', {
  state: () => ({
    fromType: 'ALBUM',
    fromName: 'Phonk',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27382ea2e9e1858aa012c57cd45',
    name: 'Die With A Smile',
    artist: 'Lady Gaga',
    duration: '5:34',
    seek: '3:43',
    percentage: 66,
    volume: 33,
    isShuffle: false,
    isPause: false,
    isRepeat: false,
    isMute: false
  }),
  actions: {
    toggleShuffle() {
      this.isShuffle = !this.isShuffle
    },
    togglePause() {
      this.isPause = !this.isPause
    },
    toggleRepeat() {
      this.isRepeat = !this.isRepeat
    },
    toggleMute() {
      this.isMute = !this.isMute
    }
  }
})
