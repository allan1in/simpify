<template></template>

<script>
import { useUserStore } from '@/stores/user'
import { mapState } from 'pinia'

export default {
  name: 'Dashboard',
  computed: {
    ...mapState(useUserStore, ['access_token'])
  }
}
</script>

<style lang="scss" scoped></style>
