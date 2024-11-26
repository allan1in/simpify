import { defineStore } from 'pinia'
import { useUserStore } from './user'
import {
  setRepeatMode,
  startPlayback,
  togglePlaybackShuffle,
  transferPlayback
} from '@/api/meta/player'
import { Howl } from 'howler'
import Message from '@/components/Message/index'
import i18n from '@/includes/i18n'
import { checkUserSavedTracks } from '@/api/meta/track'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    player: null,
    activeDevice: null,
    volume: 50,
    isShuffle: false,
    isPause: true,
    repeatMode: 0,
    isMute: false,
    percentage: 0,
    duration: 0,
    position: 0,
    current_track: null,
    context: null,
    index: 0,
    isReady: false,
    loading: true,
    isSaved: null
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
            await transferPlayback({ device_ids: [res.device_id] })
            this.activeDevice = { id: res.device_id }
            this.isReady = true
            this.loading = false
          })

          this.player.addListener('not_ready', (res) => {
            console.log('Device ID has gone offline', res)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('autoplay_failed', (res) => {
            console.log('Autoplay is not allowed by the browser autoplay rules', res)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('player_state_changed', async (res) => {
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

            await this.checkUserSavedTrack()
            this.loading = false
          })

          this.startListenPos()

          // Errors

          this.player.addListener('initialization_error', (message) => {
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('authentication_error', (message) => {
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('account_error', (message) => {
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('playback_error', (message) => {
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.connect()
        }
      } else if (useUserStore().checkProduct('free')) {
        this.loading = false
      }
    },
    startListenPos() {
      if (useUserStore().checkProduct('premium')) {
        this.player.addListener('progress', async (res) => {
          this.position = res.position
          this.percentage = 100 * (res.position / this.duration)
        })
      } else if (useUserStore().checkProduct('free')) {
        // Start to render progress bar
        this.player.on('play', () => {
          requestAnimationFrame(this.progress)
        })
      }
    },
    stopListenPos() {
      if (useUserStore().checkProduct('premium')) {
        this.player.removeListener('progress')
      } else if (useUserStore().checkProduct('free')) {
        // Stop to render progress bar
        this.player.pause()
      }
    },
    async togglePlay() {
      if (useUserStore().checkProduct('premium')) {
        if (this.isReady && !!this.current_track) {
          let state = await this.player.getCurrentState()
          if (!state) {
            // User is not playing music through the Web Playback SDK
            return
          }
          await this.player.togglePlay()
          this.isPause = !this.isPause
        } else {
          Message(`${i18n.global.t('message.no_track_playing')}`)
        }
      } else if (useUserStore().checkProduct('free')) {
        if (this.isReady) {
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
        } else {
          Message(`${i18n.global.t('message.no_track_playing')}`)
        }
      }
    },
    async nextTrack() {
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        this.loading = true
        await this.player.nextTrack()
      } else if (useUserStore().checkProduct('free')) {
        if (this.isReady) {
          Message(`${i18n.global.t('message.only_for_premium')}`)
        } else {
          Message(`${i18n.global.t('message.only_for_premium')}`)
        }
      }
    },
    async preTrack() {
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        this.loading = true
        await this.player.previousTrack()
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setRepeatMode() {
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
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
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async toggleShuffle() {
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        await togglePlaybackShuffle({ state: !this.isShuffle })
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setMute() {
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        await this.player.setVolume(0)
      } else if (useUserStore().checkProduct('free')) {
        if (!this.player?.playing) {
          return
        }
        this.player.mute(true)
      }
    },
    async setVolume() {
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        await this.player.setVolume(this.volume / 100)
      } else if (useUserStore().checkProduct('free')) {
        if (!this.player?.playing) {
          return
        }
        this.player.mute(false)
        this.player.volume(this.volume / 100)
      }
    },
    async seekPosition() {
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        await this.player.seek((this.duration * this.percentage) / 100)
        await this.startListenPos()
      } else if (useUserStore().checkProduct('free')) {
        this.player.seek((this.percentage * this.duration) / 100 / 1000)
      }
    },
    async playNewTrack(data, track) {
      if (useUserStore().checkProduct('premium')) {
        this.loading = true
        if (this.isReady) {
          await startPlayback(data)
        } else {
          Message(`${i18n.global.t('message.loading')}`)
        }
      } else if (useUserStore().checkProduct('free')) {
        this.loading = true
        // https://github.com/goldfire/howler.js?tab=readme-ov-file#quick-start
        // Distroy the player already existed
        if (this.player instanceof Howl) {
          this.player.unload()
          this.isPause = true
          this.position = 0
          this.percentage = 0
        }

        // Initialize player infomation
        this.current_track = track

        // Some of tracks don't have preview_url
        if (this.current_track.preview_url === null) {
          this.isReady = false
          return
        }

        this.player = new Howl({
          src: [this.current_track.preview_url],
          // Streaming audio (for live audio or large files)
          html5: true,
          volume: this.volume / 100
        })

        this.player.play()
        // Start to render progress bar
        this.player.on('play', () => {
          this.isPause = false
          requestAnimationFrame(this.progress)
          this.isReady = true
          this.loading = false
        })

        this.player.on('pause', () => {
          this.isPause = true
        })

        this.player.on('end', () => {
          this.isPause = true
          this.position = 0
          this.percentage = 0
        })
      }
    },
    // Refresh progress bar position only in free account mode
    progress() {
      if (this.player.playing()) {
        this.position = this.player.seek() * 1000
        this.duration = this.player.duration() * 1000

        this.percentage = (this.player.seek() / this.player.duration()) * 100

        requestAnimationFrame(this.progress)
      }
    },
    async playNewContext(data) {
      if (useUserStore().checkProduct('premium')) {
        this.loading = true
        if (this.isReady) {
          await startPlayback(data)
        } else {
          Message(`${i18n.global.t('message.loading')}`)
        }
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async checkUserSavedTrack(track = this.current_track) {
      let params = { ids: track?.id }
      const res = await checkUserSavedTracks(params)
      this.isSaved = res[0]
    }
  }
})
