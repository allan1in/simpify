<template>
  <DropDown v-model="show_menu">
    <template #trigger>
      <button
        v-tooltip="$t('tooltip.more_options', { item: track.name })"
        class="drop-down__trigger"
      >
        <div class="drop-down__trigger__icon-wrapper">
          <IconMore />
        </div>
      </button>
    </template>
    <template #dropDownItems>
      <DropDownSecondary
        @handle-mouse-enter="show_menu_secondary_playlists = true"
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
              <DropDownItem @click="addToPlaylist(item.id, item.name)" @item-click="closeMenu">{{
                item.name
              }}</DropDownItem>
            </div>
          </div>
        </template>
      </DropDownSecondary>
      <DropDownItem
        v-if="artists.length === 1"
        :to="{ name: 'Artist', params: { artistId: artists[0].id } }"
        top-line
        @item-click="closeMenu"
        @mouseenter="show_menu_secondary_playlists = false"
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
        v-else-if="artists.length > 1"
        @handle-mouse-enter="show_menu_secondary_artists = true"
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
              v-for="item in artists"
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
import { addItemsToPlaylist } from '@/api/meta/playlist'
import Message from '@/components/Message'

export default {
  name: 'DropDownMenu',
  props: {
    track: {
      type: Object,
      default: null
    },
    artists: {
      type: Array,
      default: () => []
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
    IconDefaultAlbum
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
    async addToPlaylist(id, name) {
      const data = {
        uris: [this.track.uri],
        position: 0
      }
      const res = await addItemsToPlaylist(id, data)
      if (res.snapshot_id) {
        Message(this.$t('message.added_to_playlist', { playlist: name }))
      }
    }
  },
  watch: {
    bottom: {
      handler() {
        this.closeMenu()
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
