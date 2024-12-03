import { getAlbum } from '@/api/meta/album'
import { getTrack } from '@/api/meta/track'
import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    myLibWidth: 0,
    isCollasped: false,
    isShowMore: false,
    activeTag: localStorage.getItem('LibraryActiveTag') || 'liked_songs',
    likedSongs: [],
    playlists: [],
    albums: [],
    artists: []
  }),
  actions: {
    changeActiveTag(newTag) {
      localStorage.setItem('LibraryActiveTag', newTag)
      this.activeTag = newTag
    },
    clearList(type) {
      this[type] = []
    },
    async addLikedSongs(newVals) {
      let oldVals = this.likedSongs
      if (Array.isArray(newVals)) {
        this.likedSongs = [...oldVals, ...newVals]
      } else {
        const res = await getTrack(newVals.id)
        this.likedSongs.unshift({ added_at: new Date().toISOString(), track: res })
      }
    },
    removeLikedSong(id) {
      let index = -1
      this.likedSongs.forEach((song, i) => {
        if (song.track.id === id) {
          index = i
        }
      })
      if (index > -1) {
        this.likedSongs.splice(index, 1)
      }
    },
    addPlaylists(newVals) {
      let oldVals = this.playlists
      if (Array.isArray(newVals)) {
        this.playlists = [...oldVals, ...newVals]
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
    }
  }
})
