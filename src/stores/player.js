import { defineStore } from 'pinia'
import { useUserStore } from './user'
import {
  getPlaybackState,
  setRepeatMode,
  togglePlaybackShuffle,
  transferPlayback
} from '@/api/meta/player'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    player: null,
    showFullScreenPlayer: false,
    activeDevice: {},
    volume: 50,
    isShuffle: false,
    isPause: true,
    repeatMode: 0,
    isMute: false,
    percentage: 0,
    duration: 0,
    position: 0,
    current_track: {},
    context: {}
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

        this.player.addListener('ready', async (res) => {
          console.log('Ready with Device ID', res)
          this.activeDevice = { id: res.device_id }
          await transferPlayback({ device_ids: [res.device_id] })
        })

        this.player.addListener('not_ready', (res) => {
          console.log('Device ID has gone offline', res)
        })

        this.player.addListener('autoplay_failed', (res) => {
          console.log('Autoplay is not allowed by the browser autoplay rules', res)
        })

        this.player.addListener('player_state_changed', (res) => {
          console.log('player_state_changed', res)
          if (res === null) {
            return
          } else {
            this.isPause = res.paused
            this.duration = res.duration
            this.position = res.position
            this.percentage = 100 * (res.position / res.duration)
            this.current_track = res.track_window?.current_track
            this.repeatMode = res.repeat_mode
            this.isShuffle = res.shuffle

            this.player.getVolume().then((volume) => {
              this.volume = volume * 100
            })

            this.context = res.context
          }
        })

        this.startListenPos()

        // Errors

        this.player.addListener('initialization_error', (message) => {
          console.log('initialization_error: ' + message)
        })

        this.player.addListener('authentication_error', (message) => {
          console.log('authentication_error: ' + message)
        })

        this.player.addListener('account_error', (message) => {
          console.log('account_error: ' + message)
        })

        this.player.on('playback_error', (message) => {
          console.log('playback_error: ' + message)
          if (message.split(' ').indexOf('401') !== -1) {
            console.log('playback_error: Bad or expired token')
          }
        })

        this.player.connect()
      }
    },
    startListenPos() {
      this.player.addListener('progress', async (res) => {
        this.position = res.position
        this.percentage = 100 * (res.position / this.duration)
      })
    },
    stopListenPos() {
      this.player.removeListener('progress')
    },
    async togglePlay() {
      let state = await this.player.getCurrentState()
      if (!state) {
        console.log('User is not playing music through the Web Playback SDK')
        return
      }

      var current_track = state.track_window.current_track
      var next_track = state.track_window.next_tracks[0]

      console.log('Currently Playing', current_track)
      console.log('Playing Next', next_track)
      await this.player.togglePlay()
      this.isPause = !this.isPause
    },
    nextTrack() {
      this.player.nextTrack()
    },
    preTrack() {
      this.player.previousTrack()
    },
    async setRepeatMode() {
      if (this.repeatMode === 0) {
        await setRepeatMode({ state: 'context' })
        this.repeatMode = 1
      } else if (this.repeatMode === 1) {
        await setRepeatMode({ state: 'track' })
        this.repeatMode = 2
      } else {
        await setRepeatMode({ state: 'off' })
        this.repeatMode = 0
      }
    },
    async toggleShuffle() {
      await togglePlaybackShuffle({ state: !this.isShuffle })
      this.isShuffle = !this.isShuffle
    },
    setVolume() {
      if (this.isMute) {
        this.player.setVolume(0)
      } else {
        this.player.setVolume(this.volume / 100)
      }
    }
  }
})
