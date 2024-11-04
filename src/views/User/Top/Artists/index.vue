<template>
    <main class="artists-container">
        <TitleShowAll title="Top artists this month" />
        <div class="artists-container__content">
            <CardArtist v-for="item in artists" :item />
        </div>
    </main>
</template>
<script>
import { useAppStore } from '@/stores/app';
import { mapWritableState } from 'pinia';
import TitleShowAll from '@/components/TitleShowAll/index.vue'
import CardArtist from '@/components/CardArtist/index.vue'
import { getUserTopArtists } from '@/api/meta/user';

export default {
    name: 'GetArtistsForUser',
    components: {
        TitleShowAll,
        CardArtist
    },
    computed: {
        ...mapWritableState(useAppStore, ['loading'])
    },
    data() {
        return {
            artists: [],
            artists_limit: 48,
        }
    },
    methods: {
        async getAll() {
            await this.getArtists()
            this.loading = false
        },
        async getArtists() {
            let params = {
                limit: this.artists_limit,
                offset: 0
            }
            const res = await getUserTopArtists(params)
            this.artists = res.items
        }
    },
    created() {
        this.getAll()
    }
}
</script>
<style lang="scss" scoped>
.artists-container {
    padding: $gutter-2x;

    &__content {
        @include gridCards;
    }
}
</style>