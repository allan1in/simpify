import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    showFullScreenPlayer: false,
    volume: 50,
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
    initPlayer() {
      // Import SDK
      // https://developer.spotify.com/documentation/web-playback-sdk
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.async = true
      document.body.appendChild(script)

      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = useUserStore().access_token
        this.player = new Spotify.Player({
          name: 'Web Player (Vue)',
          getOAuthToken: (cb) => {
            cb(token)
          },
          volume: this.volume / 100
        })

        // Events

        this.player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id)
        })

        this.player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id)
        })

        this.player.addListener('autoplay_failed', () => {
          console.log('Autoplay is not allowed by the browser autoplay rules')
        })

        // Errors

        this.player.addListener('initialization_error', ({ message }) => {
          console.error('SDK Error: ' + message)
        })

        this.player.addListener('authentication_error', ({ message }) => {
          console.error('SDK Error: ' + message)
        })

        this.player.addListener('account_error', ({ message }) => {
          console.error('SDK Error: ' + message)
        })

        this.player.on('playback_error', ({ message }) => {
          console.error('SDK Error: ' + message)
        })

        this.player.connect()
      }
    }
  }
})
