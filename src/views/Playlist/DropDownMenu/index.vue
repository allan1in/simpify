<template>
  <DropDown v-model="show_menu">
    <template #trigger>
      <button v-tooltip="$t('tooltip.more_options', { item: playlist.name })" class="more__btn">
        <div class="more__btn__icon-wrapper">
          <IconMore />
        </div>
      </button>
    </template>
    <template #dropDownItems>
      <DropDownItem @item-click="show_menu = false" @click="openEditDialog = true">
        <template #left>
          <div class="more__drop-down-item__icon-wrapper">
            <IconEdit />
          </div>
        </template>
        <template #default>
          {{ $t('drop_down.edit_details') }}
        </template>
      </DropDownItem>
      <DropDownItem @item-click="show_menu = false" @click="openRemoveConfirm = true">
        <template #left>
          <div class="more__drop-down-item__icon-wrapper">
            <IconRemove />
          </div>
        </template>
        <template #default>
          {{ $t('drop_down.remove') }}
        </template>
      </DropDownItem>
    </template>
  </DropDown>
  <DialogPlaylistEdit
    v-model="openEditDialog"
    :item="playlist"
    @update-succeed="handleUpdateSucceed"
  />
  <ConfirmBox
    v-model="openRemoveConfirm"
    @confirm="handleConfirmed"
    :title="$t('confirm_box_playlist_delete.title')"
    :message="$t('confirm_box_playlist_delete.message', { name: playlist.name })"
  />
</template>

<script>
import DropDown from '@/components/DropDown/index.vue'
import DropDownItem from '@/components/DropDownItem/index.vue'
import IconMore from '@/components/Icons/IconMore.vue'
import IconEdit from '@/components/Icons/IconEdit.vue'
import IconRemove from '@/components/Icons/IconRemove.vue'
import { mapState } from 'pinia'
import { useLibraryStore } from '@/stores/library'
import DialogPlaylistEdit from '@/components/DialogPlaylistEdit/index.vue'
import ConfirmBox from '@/components/ConfirmBox/index.vue'
import { deleteUserSavedPlaylists } from '@/api/meta/playlist'

export default {
  name: 'DropDownMenu',
  props: {
    playlist: {
      type: Object,
      default: null
    }
  },
  inject: ['bottom'],
  components: {
    DropDown,
    DropDownItem,
    IconMore,
    IconEdit,
    IconRemove,
    DialogPlaylistEdit,
    ConfirmBox
  },
  data() {
    return {
      show_menu: false,
      openEditDialog: false,
      openRemoveConfirm: false,
      loading_toggle_save: false
    }
  },
  emits: ['updateSucceed'],
  computed: {
    ...mapState(useLibraryStore, { playlists_by_user: 'playlists_by_user' })
  },
  methods: {
    closeMenu() {
      this.show_menu = false
    },
    async handleConfirmed() {
      await deleteUserSavedPlaylists(this.playlist.id)
      useLibraryStore().removePlaylist(this.playlist.id)
      useLibraryStore().deletePlaylistByUser(this.playlist.id)
      if (this.$route.fullPath.split('/').indexOf(this.playlist.id) !== -1) {
        this.$router.push({ name: 'Home' })
      }
      this.openRemoveConfirm = false
    },
    async handleUpdateSucceed() {
      await this.$emit('updateSucceed')
      await useLibraryStore().updatePlaylist(this.playlist)
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
.more {
  height: 2.4rem;
  aspect-ratio: 3 / 2;

  &__btn {
    height: 2.4rem;

    @include clickAnimation;

    &__icon-wrapper {
      height: 100%;
      width: 100%;
      fill: $color-font-secondary;
    }
  }

  &__drop-down-item {
    &__icon-wrapper {
      height: calc($font-size-text-primary);
      aspect-ratio: 1 / 1;
      fill: $color-font-secondary;
    }
  }
}
</style>
