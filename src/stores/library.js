import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    myLibWidth: 0,
    isCollasped: false,
    isShowMore: false
  })
})
