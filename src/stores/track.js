import { defineStore } from 'pinia'

export const useTrackStore = defineStore('track', {
  state: () => ({
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
  })
})
