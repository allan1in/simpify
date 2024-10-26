import { getPlayerState } from '@/api/meta/player'
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    showFullScreenPlayer: false,
    volume: 0,
    isShuffle: false,
    isPause: true,
    isRepeat: false,
    isRepeatSingle: false,
    isMute: false,
    fromType: 'ALBUM',
    fromName: 'Phonk',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27382ea2e9e1858aa012c57cd45',
    track: 'Die With A Smile',
    track_id: '2plbrEY59IikOBgBGLjaoe',
    artist: 'Lady Gaga',
    artist_id: '1HY2Jd0NmPuamShAr6KMms',
    percentage: 0,
    duration: '--:--',
    seek: '--:--'
  }),
  actions: {
    async getPlayerState() {
      const res = (await getPlayerState()).data
      console.log(res)
    }
  }
})
