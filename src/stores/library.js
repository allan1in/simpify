import { getAlbum } from '@/api/meta/album'
import { getTrack } from '@/api/meta/track'
import { getCurrentUserPlaylists, getNextCurrentUserPlaylists } from '@/api/meta/user'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    library_width: 0,
    active_collasped: false,
    active_show_more: false,
    during_library_width_transition: false,
    current_tag: localStorage.getItem('lib_current_tag') || 'songs',
    songs: [],
    playlists: [],
    playlists_by_user: [],
    albums: [],
    artists: [],
    resizing: false,
    loading_playlists_by_user: false,
    active_playlists_by_user:
      localStorage.getItem('lib_active_playlists_by_user') === 'true' || false
  }),
  actions: {
    updateLibraryStoreState(state, newVal) {
      localStorage.setItem(`lib_${state}`, newVal)
      this[state] = newVal
    },
    clearList(type) {
      this[type] = []
    },
    async addSongs(newVals) {
      let oldVals = this.songs
      if (Array.isArray(newVals)) {
        this.songs = [...oldVals, ...newVals]
      } else {
        const res = await getTrack(newVals.id)
        this.songs.unshift({ added_at: new Date().toISOString(), track: res })
      }
    },
    removeSong(id) {
      let index = -1
      this.songs.forEach((song, i) => {
        if (song.track.id === id) {
          index = i
        }
      })
      if (index > -1) {
        this.songs.splice(index, 1)
      }
    },
    addPlaylists(newVals) {
      if (Array.isArray(newVals)) {
        this.playlists = this.playlists.concat(newVals)
      } else {
        this.playlists.unshift(newVals)
      }
    },
    removePlaylist(id) {
      let index = -1
      this.playlists.forEach((item, i) => {
        if (item.id === id) {
          index = i
        }
      })
      if (index > -1) {
        this.playlists.splice(index, 1)
      }
    },
    createPlaylistByUser(newVals) {
      this.playlists_by_user.unshift(newVals)
    },
    deletePlaylistByUser(id) {
      let index = -1
      this.playlists_by_user.forEach((item, i) => {
        if (item.id === id) {
          index = i
        }
      })
      if (index > -1) {
        this.playlists_by_user.splice(index, 1)
      }
    },
    updatePlaylist(newVal) {
      let index = -1
      this.playlists.forEach((item, i) => {
        if (item.id === newVal.id) {
          index = i
        }
      })
      if (index > -1) {
        this.playlists.splice(index, 1, newVal)
      }
    },
    async addAlbums(newVals) {
      let oldVals = this.albums
      if (Array.isArray(newVals)) {
        this.albums = [...oldVals, ...newVals]
      } else {
        const res = await getAlbum(newVals.id)
        this.albums.unshift({ added_at: new Date().toISOString(), album: res })
      }
    },
    removeAlbum(id) {
      let index = -1
      this.albums.forEach((item, i) => {
        if (item.album.id === id) {
          index = i
        }
      })
      if (index > -1) {
        this.albums.splice(index, 1)
      }
    },
    addArtists(newVals) {
      let oldVals = this.artists
      if (Array.isArray(newVals)) {
        this.artists = [...oldVals, ...newVals]
      } else {
        this.artists.unshift(newVals)
      }
    },
    removeArtist(id) {
      let index = -1
      this.artists.forEach((item, i) => {
        if (item.id === id) {
          index = i
        }
      })
      if (index > -1) {
        this.artists.splice(index, 1)
      }
    },
    async getPlaylistsOwnedByUser() {
      this.loading_playlists_by_user = true
      this.playlists_by_user = []

      let next = ''
      let offset = 0
      let limit = 20
      while (next !== null) {
        this.loading_more = true
        let res

        if (next === '') {
          const params = {
            limit,
            offset
          }
          res = await getCurrentUserPlaylists(params)
        } else {
          let path = next
          res = await getNextCurrentUserPlaylists(path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items.filter(
          (item) => item !== null && item.owner.id === useUserStore().uid
        )

        this.playlists_by_user = this.playlists_by_user.concat(newVals)
        next = res.next
      }

      this.loading_playlists_by_user = false
    }
  }
})
