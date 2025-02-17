import { defineStore } from 'pinia'
import { useUserStore } from './user'
import {
  setRepeatMode,
  startPlayback,
  togglePlaybackShuffle,
  transferPlayback
} from '@/api/meta/player'
import Message from '@/components/Message/index'
import i18n from '@/includes/i18n'
import { checkUserSavedTracks, deleteUserSavedTracks, saveTracks } from '@/api/meta/track'
import { useLibraryStore } from './library'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    player: null,
    volume: 50,
    active_shuffle: false,
    active_pause: true,
    repeat_mode: 0,
    percentage: 0,
    duration: 0,
    position: 0,
    current_track: null,
    context: null,
    index: 0,
    initialized: false,
    loading: false,
    saved: null
  }),
  actions: {
    initPlayer() {
      if (useUserStore().checkProduct('premium')) {
        console.log('start init player')
        this.initialized = false
        this.loading = false
        // Import SDK
        // https://developer.spotify.com/documentation/web-playback-sdk
        const script = document.createElement('script')
        script.src = 'https://sdk.scdn.co/spotify-player.js'
        script.async = true
        document.body.appendChild(script)

        window.onSpotifyWebPlaybackSDKReady = () => {
          const token = useUserStore().access_token
          this.player = new window.Spotify.Player({
            name: 'Simpify Player (desktop)',
            getOAuthToken: (cb) => {
              cb(token)
            },
            volume: this.volume / 100
          })

          // Events

          this.player.addListener('ready', async (res) => {
            console.log('ready')
            await transferPlayback({ device_ids: [res.device_id] })
            this.initialized = true
          })

          this.player.addListener('not_ready', (res) => {
            console.log('Device ID has gone offline', res)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('autoplay_failed', (res) => {
            console.log(res)
            Message(`${i18n.global.t('message.autoplay_failed')}`)
          })

          this.player.addListener('player_state_changed', async (res) => {
            if (res === null) {
              return
            } else {
              if (!res.paused && res.position > 0) {
                this.active_pause = false
              } else {
                this.active_pause = true
              }
              // Only upadte the state of saved when current_track has changed
              if (this.current_track?.id != res.track_window?.current_track?.id) {
                const resp = await checkUserSavedTracks({
                  ids: res.track_window?.current_track?.id
                })
                this.saved = resp?.[0]
              }
              this.duration = res.duration
              this.position = res.position
              this.percentage = 100 * (res.position / res.duration)
              this.current_track = res.track_window?.current_track
              this.repeat_mode = res.repeat_mode
              this.active_shuffle = res.shuffle

              this.player.getVolume().then((volume) => {
                this.volume = volume * 100
              })

              this.context = res.context
            }
            this.loading = false
          })

          this.startListenPos()

          // Errors

          this.player.addListener('initialization_error', (message) => {
            console.log('initialization_error')
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('authentication_error', async (message) => {
            console.log('authentication_error')
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
            await this.player.disconnect()
            await useUserStore().refreshToken()
            await this.initPlayer()
          })

          this.player.addListener('account_error', (message) => {
            console.log('account_error')
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
          })

          this.player.addListener('playback_error', async (message) => {
            console.log('playback_error')
            console.log(message)
            Message(`${i18n.global.t('message.something_wrong')}`)
            await this.player.disconnect()
            await useUserStore().refreshToken()
            await this.initPlayer()
          })

          this.player.connect()
        }
      } else if (useUserStore().checkProduct('free')) {
        this.initialized = true
      }
    },
    startListenPos() {
      if (useUserStore().checkProduct('premium')) {
        this.player.addListener('progress', async (res) => {
          if (res.position > 0) {
            this.active_pause = false
          }
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
        if (this.initialized && !!this.current_track) {
          let state = await this.player.getCurrentState()
          if (!state) {
            // User is not playing music through the Web Playback SDK
            return
          }
          await this.player.togglePlay()
        } else {
          Message(`${i18n.global.t('message.no_track_playing')}`)
        }
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async nextTrack() {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      } else if (!this.initialized) {
        Message(`${i18n.global.t('message.unready')}`)
        return
      }
      if (useUserStore().checkProduct('premium') && this.initialized && !!this.current_track) {
        this.active_pause = true
        this.loading = true
        await this.player.nextTrack()
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async preTrack() {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      } else if (!this.initialized) {
        Message(`${i18n.global.t('message.unready')}`)
        return
      }
      if (useUserStore().checkProduct('premium') && this.initialized && !!this.current_track) {
        this.active_pause = true
        this.loading = true
        await this.player.previousTrack()
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setRepeatMode() {
      if (useUserStore().checkProduct('premium') && this.initialized && !!this.current_track) {
        if (this.repeat_mode === 0) {
          await setRepeatMode({ state: 'context' })
          this.repeat_mode = 1
        } else if (this.repeat_mode === 1) {
          await setRepeatMode({ state: 'track' })
          this.repeat_mode = 2
        } else {
          await setRepeatMode({ state: 'off' })
          this.repeat_mode = 0
        }
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async toggleShuffle() {
      if (useUserStore().checkProduct('premium') && this.initialized && !!this.current_track) {
        await togglePlaybackShuffle({ state: !this.active_shuffle })
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setMute() {
      if (useUserStore().checkProduct('premium') && this.initialized) {
        await this.player.setVolume(0)
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setVolume() {
      if (useUserStore().checkProduct('premium') && this.initialized) {
        await this.player.setVolume(this.volume / 100)
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async seekPosition() {
      if (useUserStore().checkProduct('premium') && this.initialized && !!this.current_track) {
        await this.player.seek((this.duration * this.percentage) / 100)
        await this.startListenPos()
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async playNewTrack(data) {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      } else if (!this.initialized) {
        Message(`${i18n.global.t('message.unready')}`)
        return
      }
      if (useUserStore().checkProduct('premium')) {
        this.loading = true
        await startPlayback(data)
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async playNewContext(data) {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      } else if (!this.initialized) {
        Message(`${i18n.global.t('message.unready')}`)
        return
      }
      if (useUserStore().checkProduct('premium')) {
        this.loading = true
        if (this.initialized) {
          await startPlayback(data)
        } else {
          Message(`${i18n.global.t('message.loading')}`)
        }
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async toggleTrackSave() {
      if (this.saved) {
        await deleteUserSavedTracks({ ids: this.current_track?.id })
        this.saved = false
        useLibraryStore().removeSong(this.current_track.id)
        Message(`${i18n.global.t('message.removed_from_lib')}`)
      } else {
        await saveTracks({ ids: this.current_track?.id })
        this.saved = true
        useLibraryStore().addSongs(this.current_track)
        Message(`${i18n.global.t('message.added_to_lib')}`)
      }
    }
  }
})
