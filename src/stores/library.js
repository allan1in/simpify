import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    myLibWidth: 0,
    isCollasped: false,
    isShowMore: false,
    activeTag: localStorage.getItem('LibraryActiveTag') || 'liked_songs'
  }),
  actions: {
    changeActiveTag(newTag) {
      localStorage.setItem('LibraryActiveTag', newTag)
      this.activeTag = newTag
    }
  }
})
