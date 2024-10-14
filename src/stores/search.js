import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    showTracks: true,
    showAlbums: true,
    showArtists: true,
    checkLoading: true
  })
})
