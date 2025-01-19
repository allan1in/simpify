<template>
  <DropDown v-model="show_menu">
    <template #trigger>
      <button class="more-wrapper__icon-wrapper"><IconMore /></button>
    </template>
    <template #dropDownItems>
      <DropDownSecondary
        @handle-mouse-enter="closeOtherMenuSecondary('show_menu_secondary_playlists')"
        v-model="show_menu_secondary_playlists"
      >
        <template #trigger>
          <DropDownItem @mouseenter="closeOtherMenuSecondary('show_menu_secondary_playlists')">
            <template #left>
              <div class="icon-wrapper">
                <IconPlus />
              </div>
            </template>
            <template #default>
              {{ $t('drop_down.add_to_playlist') }}
            </template>
            <template #right>
              <div class="icon-wrapper">
                <IconTriangleRight />
              </div>
            </template>
          </DropDownItem>
        </template>
        <template #dropDownItems>
          <div class="drop-down__item__drop-down-secondary__item-wrapper">
            <div
              v-for="item in playlists_by_user"
              :key="item.id"
              class="drop-down__item__drop-down-secondary__item-wrapper__item"
            >
              <DropDownItem
                @click="handleAddToPlaylist(item.id, item.name)"
                @item-click="closeMenu"
                >{{ item.name }}</DropDownItem
              >
            </div>
          </div>
        </template>
      </DropDownSecondary>
      <DropDownItem
        v-if="playlist != {}"
        @item-click="closeMenu"
        @mouseenter="closeOtherMenuSecondary"
        @click="handleRemoveTrackFromPlaylist"
      >
        <template #left>
          <div class="icon-wrapper">
            <IconTrashBin />
          </div>
        </template>
        <template #default>
          {{ $t('drop_down.remove_from_this_playlist') }}
        </template>
      </DropDownItem>
      <DropDownItem
        v-if="track.artists.length === 1"
        :to="{ name: 'Artist', params: { artistId: track.artists[0].id } }"
        top-line
        @item-click="closeMenu"
        @mouseenter="closeOtherMenuSecondary('show_menu_secondary_artists')"
      >
        <template #left>
          <div class="icon-wrapper">
            <IconDefaultArtist />
          </div>
        </template>
        <template #default>
          {{ $t('drop_down.go_to_artist') }}
        </template>
      </DropDownItem>
      <DropDownSecondary
        v-else-if="track.artists.length > 1"
        @handle-mouse-enter="closeOtherMenuSecondary('show_menu_secondary_artists')"
        v-model="show_menu_secondary_artists"
      >
        <template #trigger>
          <DropDownItem
            top-line
            @mouseenter="closeOtherMenuSecondary('show_menu_secondary_artists')"
          >
            <template #left>
              <div class="icon-wrapper">
                <IconDefaultArtist />
              </div>
            </template>
            <template #default>
              {{ $t('drop_down.go_to_artist') }}
            </template>
            <template #right>
              <div class="icon-wrapper">
                <IconTriangleRight />
              </div>
            </template>
          </DropDownItem>
        </template>
        <template #dropDownItems>
          <div class="drop-down__item__drop-down-secondary__item-wrapper">
            <div
              v-for="item in track.artists"
              :key="item.id"
              class="drop-down__item__drop-down-secondary__item-wrapper__item"
            >
              <DropDownItem
                :to="{ name: 'Artist', params: { artistId: item.id } }"
                @item-click="closeMenu"
                >{{ item.name }}</DropDownItem
              >
            </div>
          </div>
        </template>
      </DropDownSecondary>
      <DropDownItem
        :to="{ name: 'Album', params: { albumId: track.album.id } }"
        @item-click="closeMenu"
        @mouseenter="closeOtherMenuSecondary"
      >
        <template #left>
          <div class="icon-wrapper">
            <IconDefaultAlbum />
          </div>
        </template>
        <template #default>
          {{ $t('drop_down.go_to_album') }}
        </template>
      </DropDownItem>
    </template>
  </DropDown>
</template>

<script>
import DropDown from '@/components/DropDown/index.vue'
import DropDownItem from '@/components/DropDownItem/index.vue'
import IconPlus from '@/components/Icons/IconPlus.vue'
import IconMore from '@/components/Icons/IconMore.vue'
import IconTriangleRight from '@/components/Icons/IconTriangleRight.vue'
import DropDownSecondary from '@/components/DropDownSecondary/index.vue'
import IconDefaultArtist from '@/components/Icons/IconDefaultArtist.vue'
import IconDefaultAlbum from '@/components/Icons/IconDefaultAlbum.vue'
import { mapState } from 'pinia'
import { useLibraryStore } from '@/stores/library'
import { addItemsToPlaylist, removePlaylistItems } from '@/api/meta/playlist'
import Message from '@/components/Message'
import IconTrashBin from '@/components/Icons/IconTrashBin.vue'

export default {
  name: 'DropDownMenu',
  props: {
    track: {
      type: Object,
      default: null
    },
    playlist: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['bottom'],
  components: {
    DropDown,
    DropDownItem,
    IconPlus,
    IconMore,
    IconTriangleRight,
    DropDownSecondary,
    IconDefaultArtist,
    IconDefaultAlbum,
    IconTrashBin
  },
  data() {
    return {
      show_menu_secondary_playlists: false,
      show_menu: false,
      show_menu_secondary_artists: false
    }
  },
  computed: {
    ...mapState(useLibraryStore, { playlists_by_user: 'playlists_by_user' })
  },
  methods: {
    async handleRemoveTrackFromPlaylist() {
      const data = {
        tracks: [
          {
            uri: this.track.uri
          }
        ]
      }
      const res = await removePlaylistItems(this.playlist.id, data)
      if (res.snapshot_id) {
        Message(this.$t('message.removed_from_playlist', { playlist: this.playlist.name }))
        this.$emit('removeSucceed', this.track.id)
      }
    },
    closeOtherMenuSecondary(propName) {
      this.show_menu_secondary_playlists = false
      this.show_menu_secondary_artists = false

      if (propName) {
        this[propName] = true
      }
    },
    closeMenu() {
      this.closeOtherMenuSecondary()
      this.show_menu = false
    },
    async handleAddToPlaylist(id, name) {
      const data = {
        uris: [this.track.uri]
      }
      const res = await addItemsToPlaylist(id, data)
      if (res.snapshot_id) {
        this.$emit('addSucceed', id, this.track)
        Message(this.$t('message.added_to_playlist', { playlist: name }))
      }
    }
  },
  watch: {
    bottom: {
      handler() {
        if (this.show_menu) {
          this.closeMenu()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-wrapper {
  height: calc($font-size-text-primary);
  aspect-ratio: 1 / 1;
  fill: $color-font-secondary;
}

.more-wrapper__icon-wrapper {
  display: block;
  cursor: pointer;
  height: $font-size-text-primary;
  aspect-ratio: 3 / 2;
  fill: $color-font-primary;

  @include clickAnimation;
}

.drop-down {
  &__trigger {
    height: 2.4rem;

    @include clickAnimation;

    &__icon-wrapper {
      height: 100%;
      width: 100%;
      fill: $color-font-secondary;
    }
  }

  &__item {
    &__drop-down-secondary {
      &__item-wrapper {
        padding: 0.3rem;

        &__item {
          max-width: 20rem;
        }
      }
    }
  }
}
</style>
