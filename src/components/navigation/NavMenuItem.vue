<template>
  <!-- <div> -->
    <v-list-item
      v-if="!menuItem.items"
      :input-value="menuItem.value"
      :to="menuItem.link"
      :exact="menuItem.exact"
      :disabled="menuItem.disabled"
      class="navcard flex-column"
      :class="menuItem.color + '--text'"
      :active-class="menuItem.color + ' active'"
      link
    >
      <!-- <v-icon class="text-h3">{{ menuItem.icon || 'mdi-circle-medium' }}</v-icon> -->
      <i class="text-h4 text-sm-h3 mdi" :class="menuItem.icon || 'mdi-circle-medium'"></i>
      <div class="text-h7 font-weight-black">{{ menuItem.text }}</div>
    </v-list-item>

    <!-- <v-list-group
      v-else
      :value="menuItem.regex ? menuItem.regex.test($route.path) : false"
      :disabled="menuItem.disabled"
      :sub-group="subgroup"
      :to="menuItem.link"
      link
    >

      <template v-slot:activator>
        <v-list-item-icon v-if="!subgroup">
          <v-icon>{{ menuItem.icon || 'mdi-circle-medium' }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ menuItem.text }}</v-list-item-title>
        </v-list-item-content>
      </template>

      <slot></slot>

    </v-list-group> -->
  <!-- </div> -->
</template>

<script>
/*
|---------------------------------------------------------------------
| Navigation Menu Item Component
|---------------------------------------------------------------------
|
| Navigation items for the NavMenu component
|
*/
export default {
  props: {
    menuItem: {
      type: Object,
      default: () => {}
    },
    subgroup: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

.navcard {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-top: 4px;
  padding-bottom: 6px;
  padding-left: 8px;
  padding-right: 8px;

  // border-width: 1px;
  // border-style: solid;

  min-height: 0 !important;

  font-size: 1rem;
  line-height: 1rem;
  text-align: start;

  transition: all 0.25s;

  div, i{
    width: 100%;
  }

  &:hover {
    background-color: inherit;
  }
}
.active {
  color: white !important;
  text-align: end;
}
</style>
