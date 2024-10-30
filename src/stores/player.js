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
    activeDevice: {},
    showFullScreenPlayer: false,
    volume: 50,
    isShuffle: false,
    isPause: true,
    repeatMode: 0,
    isMute: false,
    percentage: 0,
    duration: 0,
    position: 0,
    album: {},
    track: {},
    artists: []
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
          const state = await getPlaybackState()
          if (!state.device) {
            this.activeDevice = res.device_id
            await transferPlayback({ device_ids: [res.device_id] })
          } else {
            this.activeDevice = state.device
            this.volume = this.activeDevice.volume_percent
            this.repeatMode = state.repeat_state
            this.shuffle = state.shuffle_state
            this.isPause = !state.is_playing
            this.album = state.item.album
            this.artists = state.item.artists
            this.track = { name: state.item.name, id: state.item.id }
            this.duration = state.item.duration_ms
            this.position = state.progress_ms
            this.percentage = 100 * (this.position / this.duration)
          }
        })

        this.player.addListener('not_ready', (res) => {
          console.log('Device ID has gone offline', res)
        })

        this.player.addListener('autoplay_failed', (res) => {
          console.log('Autoplay is not allowed by the browser autoplay rules', res)
        })

        this.player.addListener('player_state_changed', (res) => {
          this.isPause = res.paused
          this.duration = res.duration
          this.position = res.position
          this.percentage = 100 * (res.position / res.duration)
          this.album = res.track_window.current_track.album
          this.track = {
            id: res.track_window.current_track.id,
            name: res.track_window.current_track.name
          }
          this.artists = res.track_window.current_track.artists
          this.repeatMode = res.repeat_mode
          this.isShuffle = res.shuffle

          this.player.getVolume().then((volume) => {
            this.volume = volume * 100
          })
        })

        // Errors

        this.player.addListener('initialization_error', (message) => {
          console.log('SDK Error: ' + message)
        })

        this.player.addListener('authentication_error', (message) => {
          console.log('SDK Error: ' + message)
        })

        this.player.addListener('account_error', (message) => {
          console.log('SDK Error: ' + message)
        })

        this.player.on('playback_error', (message) => {
          console.log(message)
        })

        this.player.connect()
        this.listenPos()
      }
    },
    listenPos() {
      this.player.addListener('progress', async (res) => {
        this.position = res.position
        this.percentage = 100 * (res.position / this.duration)

        this.volume = (await this.player.getVolume()) * 100
      })
    },
    stopListenPos() {
      this.player.removeListener('progress')
    },
    async togglePlay() {
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
