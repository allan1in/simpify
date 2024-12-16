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
            this.isReady = true
            this.loading = false
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
                this.isPause = false
                this.loading = false
              } else {
                this.isPause = true
              }
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

            this.isSaved = (await checkUserSavedTracks({ ids: this.current_track?.id }))?.[0]
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
        this.loading = false
      }
    },
    startListenPos() {
      if (useUserStore().checkProduct('premium')) {
        this.player.addListener('progress', async (res) => {
          if (res.position > 0) {
            this.isPause = false
            this.loading = false
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
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      }
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
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async nextTrack() {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      }
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
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
      }
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        this.loading = true
        await this.player.previousTrack()
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setRepeatMode() {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      }
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
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      }
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        await togglePlaybackShuffle({ state: !this.isShuffle })
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setMute() {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      }
      if (useUserStore().checkProduct('premium') && this.isReady) {
        await this.player.setVolume(0)
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async setVolume() {
      if (useUserStore().checkProduct('premium') && this.isReady) {
        await this.player.setVolume(this.volume / 100)
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async seekPosition() {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      }
      if (useUserStore().checkProduct('premium') && this.isReady && !!this.current_track) {
        await this.player.seek((this.duration * this.percentage) / 100)
        await this.startListenPos()
      } else if (useUserStore().checkProduct('free')) {
        Message(`${i18n.global.t('message.only_for_premium')}`)
      }
    },
    async playNewTrack(data) {
      if (this.loading || !this.isReady) {
        Message(`${i18n.global.t('message.loading')}`)
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
      }
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
    async toggleTrackSave() {
      if (this.loading) {
        Message(`${i18n.global.t('message.loading')}`)
        return
      }
      if (this.isSaved) {
        await deleteUserSavedTracks({ ids: this.current_track?.id })
        this.isSaved = (await checkUserSavedTracks({ ids: this.current_track?.id }))?.[0]
        if (!this.isSaved) {
          useLibraryStore().removeLikedSong(this.current_track.id)
          Message(`${i18n.global.t('message.removed_from_liked_songs')}`)
        }
      } else {
        await saveTracks({ ids: this.current_track?.id })
        this.isSaved = (await checkUserSavedTracks({ ids: this.current_track?.id }))?.[0]
        if (this.isSaved) {
          useLibraryStore().addLikedSongs(this.current_track)
          Message(`${i18n.global.t('message.added_to_liked_songs')}`)
        }
      }
    }
  }
})
