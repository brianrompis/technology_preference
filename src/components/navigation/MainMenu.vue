<template>
  <v-list nav class="py-0 py-sm-7 d-flex flex-column justify-space-between" style="min-height: 100%">
    <div v-for="(item, index) in menu" :key="index" class="my-1">
        <div class="d-flex flex-grow-1 flex-column">
          <div v-if="item.text" class="d-flex flex-row font-weight-bold justify-space-around align-center">
            <i class="text-h5 mdi" :class="item.icon || 'mdi-circle-medium'"></i>
            <div class="text-h7 font-weight-black text-uppercase" >{{ item.text }}</div>
          </div>
          <v-divider v-if="item.text"/>
          <nav-menu :menu="item.items" />
        </div>
    </div>
  </v-list>
</template>

<script>
import NavMenu from './NavMenu'

export default {
  components: {
    NavMenu
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
