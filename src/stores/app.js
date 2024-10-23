import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        showFullScreenPlayer:false
    }),
    actions:{
        toggleFullScreemPlayer(){
            this.showFullScreenPlayer=!this.showFullScreenPlayer
        }
    }
})