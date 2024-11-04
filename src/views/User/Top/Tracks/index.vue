<template>
    <main class="tracks-container">
        <TitleShowAll title="Top tracks this month" />
        <div class="tracks-container__content">
            <HeaderTrackList />
            <CardTrack v-for="item, index in tracks" :item :index :uris="uris" />
        </div>
    </main>
</template>
<script>
import { useAppStore } from '@/stores/app';
import { mapWritableState } from 'pinia';
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import HeaderTrackList from '@/components/HeaderTrackList/index.vue'
import CardTrack from '@/components/CardTrack/index.vue'
import { getUserTopSongs } from '@/api/meta/user';

export default {
    name: 'GetTracksForUser',
    components: {
        TitleShowAll,
        HeaderTrackList,
        CardTrack
    },
    computed: {
        ...mapWritableState(useAppStore, ['loading']),
        uris() {
            let uris = []
            this.tracks.forEach((item) => {
                uris.push(item.uri)
            })
            return uris
        }
    },
    data() {
        return {
            tracks: [],
            tracks_limit: 50
        }
    },
    methods: {
        async getAll() {
            await this.getTracks()
            this.loading = false
        },
        async getTracks() {
            let params = {
                limit: this.tracks_limit,
                offset: 0
            }
            const res = await getUserTopSongs(params)
            this.tracks = res.items
        }
    },
    created() {
        this.getAll()
    }
}
</script>
<style lang="scss" scoped>
.tracks-container {
    padding: $gutter-2x;
}
</style>