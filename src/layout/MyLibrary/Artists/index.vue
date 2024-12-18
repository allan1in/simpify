<template>
  <template v-if="active">
    <template v-if="!loading_skeleton">
      <div class="my-library__container__content__artists">
        <TransitionGroup name="list">
          <CardArtistLibrary v-for="item in artists" :key="item.id" :item="item" />
        </TransitionGroup>
      </div>
    </template>
    <template v-else>
      <div class="my-library__container__content__artists">
        <CardArtistLibrary v-for="i in artists_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </template>
  </template>
</template>

<script>
import { getCurrentUserArtists, getNextCurrentUserArtists } from '@/api/meta/user'
import CardArtistLibrary from '@/components/CardArtistLibrary/index.vue'
import { useLibraryStore } from '@/stores/library';
import { mapState } from 'pinia';

export default {
  name: 'Artists',
  inject: ['bottom'],
  data() {
    return {
      artists_limit: 20,
      artists_next: '',
      loading_skeleton: true
    }
  },
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CardArtistLibrary
  },
  computed: {
    ...mapState(useLibraryStore, ['artists'])
  },
  methods: {
    reset() {
      useLibraryStore().clearList('artists')
      this.artists_limit = 20
      this.artists_next = ''
      this.loading_skeleton = true
    },
    async getAll() {
      await this.getCurrentUserArtists()

      this.loading_skeleton = false
    },
    async getCurrentUserArtists() {
      if (!this.loading_more && this.artists_next !== null) {
        this.loading_more = true
        let res

        if (this.artists_next === '') {
          const params = {
            limit: this.artists_limit
          }
          res = await getCurrentUserArtists(params)
        } else {
          let path = this.artists_next
          res = await getNextCurrentUserArtists(path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.artists.items.filter(item => item !== null)
        useLibraryStore().addArtists(newVals)
        this.artists_next = res.artists.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom: {
      handler(newVal) {
        if (newVal <= 0) {
          this.getCurrentUserArtists()
        }
      },
      immediate: true
    },
    active: {
      handler(newVal) {
        if (newVal) {
          this.reset()
          this.getAll()
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
