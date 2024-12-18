<template>
  <template v-if="active">
    <template v-if="!loading_skeleton">
      <div class="my-library__container__content__albums">
        <TransitionGroup name="list">
          <CardAlbumLibrary v-for="item in albums" :key="item.album.id" :item="item.album" />
        </TransitionGroup>
      </div>
    </template>
    <template v-else>
      <div class="my-library__container__content__albums">
        <CardAlbumLibrary v-for="i in albums_limit" :key="i" :loading="loading_skeleton" />
      </div>
    </template>
  </template>
</template>

<script>
import { getCurrentUserAlbums, getNextCurrentUserAlbums } from '@/api/meta/user'
import CardAlbumLibrary from '@/components/CardAlbumLibrary/index.vue'
import { useLibraryStore } from '@/stores/library';
import { mapState } from 'pinia';

export default {
  name: 'Albums',
  inject: ['bottom'],
  data() {
    return {
      albums_limit: 20,
      albums_offset: 0,
      albums_next: '',
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
    CardAlbumLibrary
  },
  computed: {
    ...mapState(useLibraryStore, ['albums'])
  },
  methods: {
    reset() {
      useLibraryStore().clearList('albums')
      this.albums_limit = 20
      this.albums_offset = 0
      this.albums_next = ''
      this.loading_skeleton = true
    },
    async getAll() {
      await this.getCurrentUserAlbums()

      this.loading_skeleton = false
    },
    async getCurrentUserAlbums() {
      if (!this.loading_more && this.albums_next !== null) {
        this.loading_more = true
        let res

        if (this.albums_next === '') {
          const params = {
            limit: this.albums_limit,
            offset: this.albums_offset
          }
          res = await getCurrentUserAlbums(params)
        } else {
          let path = this.albums_next
          res = await getNextCurrentUserAlbums(path.slice(path.indexOf('?') + 1))
        }

        let newVals = res.items.filter(item => item !== null)
        useLibraryStore().addAlbums(newVals)
        this.albums_next = res.next

        this.loading_more = false
      }
    }
  },
  watch: {
    bottom: {
      handler(newVal) {
        if (newVal <= 0) {
          this.getCurrentUserAlbums()
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
