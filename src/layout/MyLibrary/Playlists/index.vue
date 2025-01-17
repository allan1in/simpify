<template>
  <template v-if="active">
    <template v-if="!loading_skeleton">
      <div class="my-library__container__content__playlists">
        <TransitionGroup name="list">
          <CardPlaylistLibrary v-for="item in current_playlists" :key="item.id" :item />
        </TransitionGroup>
      </div>
    </template>
    <template v-else>
      <div class="my-library__container__content__playlists">
        <CardPlaylistLibrary v-for="i in playlists_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </template>
  </template>
</template>
<script>
import { getCurrentUserPlaylists, getNextCurrentUserPlaylists } from '@/api/meta/user'
import CardPlaylistLibrary from '@/components/CardPlaylistLibrary/index.vue'
import { useLibraryStore } from '@/stores/library'
import { mapState } from 'pinia'

export default {
  name: 'Playlists',
  inject: ['bottom'],
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      playlists_limit: 20,
      playlists_offset: 0,
      playlists_next: '',
      loading_skeleton: true
    }
  },
  components: {
    CardPlaylistLibrary
  },
  computed: {
    ...mapState(useLibraryStore, ['playlists', 'active_playlists_by_user', 'playlists_by_user']),
    current_playlists() {
      if (this.active_playlists_by_user) {
        return this.playlists_by_user
      }
      return this.playlists
    }
  },
  methods: {
    async getAll() {
      await Promise.all([
        this.getCurrentUserPlaylists(),
        useLibraryStore().getPlaylistsOwnedByUser()
      ])

      this.loading_skeleton = false
    },
    async getCurrentUserPlaylists() {
      if (!this.loading_more && this.playlists_next !== null) {
        this.loading_more = true
        let res

        if (this.playlists_next === '') {
          const params = {
            limit: this.playlists_limit,
            offset: this.playlists_offset
          }
          res = await getCurrentUserPlaylists(params)
        } else {
          let path = this.playlists_next
          res = await getNextCurrentUserPlaylists(path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items.filter((item) => item !== null)

        useLibraryStore().addPlaylists(newVals)
        this.playlists_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom: {
      handler(newVal) {
        if (newVal <= 0 && this.active) {
          this.getCurrentUserPlaylists()
        }
      },
      immediate: true
    }
  },
  created() {
    this.getAll()
  }
}
</script>

<style lang="scss" scoped>
.my-library__container__content__playlists {
  position: relative;
}
</style>
