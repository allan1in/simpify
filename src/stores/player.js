import { defineStore } from 'pinia'
import { useUserStore } from './user'
import {
  setRepeatMode,
  startPlayback,
  togglePlaybackShuffle,
  transferPlayback
} from '@/api/meta/player'
import { Howl } from 'howler'

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
    context: {},
    isReady: false
  }),
  actions: {
    initPlayer() {
      if (useUserStore().checkProduct('premium')) {
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
            await transferPlayback({ device_ids: [res.device_id] })
            this.activeDevice = { id: res.device_id }
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
            this.isReady = true
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
            console.error(message)
          })

          this.player.addListener('playback_error', (message) => {
            console.log('playback_error: ' + message)
            this.$router.push({ name: 'Login' })
          })

          this.player.connect()
        }
      } else if (useUserStore().checkProduct('free')) {
        this.isReady = true
      }
    },
    startListenPos() {
      if (useUserStore().checkProduct('premium')) {
        this.player.addListener('progress', async (res) => {
          this.position = res.position
          this.percentage = 100 * (res.position / this.duration)
        })
      }
    },
    stopListenPos() {
      if (useUserStore().checkProduct('premium')) {
        this.player.removeListener('progress')
      }
    },
    async togglePlay() {
      if (useUserStore().checkProduct('premium')) {
        let state = await this.player.getCurrentState()
        if (!state) {
          // User is not playing music through the Web Playback SDK
          return
        }
        await this.player.togglePlay()
        this.isPause = !this.isPause
      } else if (useUserStore().checkProduct('free')) {
        if (!this.player?.playing) {
          return
        }
        if (this.player.playing()) {
          this.player.pause()
          this.isPause = true
        } else {
          this.player.play()
          this.isPause = false
        }
      }
    },
    nextTrack() {
      if (useUserStore().checkProduct('premium')) {
        this.player.nextTrack()
      }
    },
    preTrack() {
      if (useUserStore().checkProduct('premium')) {
        this.player.previousTrack()
      }
    },
    async setRepeatMode() {
      if (useUserStore().checkProduct('premium')) {
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
      }
    },
    async toggleShuffle() {
      if (useUserStore().checkProduct('premium')) {
        await togglePlaybackShuffle({ state: !this.isShuffle })
      }
    },
    setVolume() {
      if (useUserStore().checkProduct('premium')) {
        if (this.isMute) {
          this.player.setVolume(0)
        } else {
          this.player.setVolume(this.volume / 100)
        }
      }
    },
    async seekPosition() {
      if (useUserStore().checkProduct('premium')) {
        await this.player.seek((this.duration * this.percentage) / 100)
        await this.startListenPos()
      } else if (useUserStore().checkProduct('free')) {
      }
    },
    async playNewTrack(data, track) {
      if (useUserStore().checkProduct('premium')) {
        await startPlayback(data)
      } else if (useUserStore().checkProduct('free')) {
        // Distroy the Howl object already existed
        if (this.player instanceof Howl) {
          this.player.unload()
        }
        this.current_track = track

        this.player = new Howl({
          src: [track.preview_url],
          // Use HTML5 API to get audio file
          html5: true
        })

        this.player.play()
        this.isPause = false

        // Start to render progress bar
        this.player.on('play', () => {
          requestAnimationFrame(this.progress)
        })
      }
    },
    // Refresh progress bar position in free account mode
    progress() {
      this.position = this.player.seek() * 1000
      this.duration = this.player.duration() * 1000

      this.percentage = (this.player.seek() / this.player.duration()) * 100

      if (this.player.playing()) {
        requestAnimationFrame(this.progress)
      }
    }
  }
})
