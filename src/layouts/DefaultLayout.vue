<template>
  <div
    v-shortkey="['ctrl', '/']"
    class="d-flex flex-grow-1"
    @shortkey="onKeyup"
  >
    <!-- Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      floating
      class="elevation-1"
      :width="144"
      :right="$vuetify.rtl"
      :light="menuTheme === 'light'"
      :dark="menuTheme === 'dark'"
    >
      <!-- Navigation menu info -->
      <!-- <template v-slot:prepend>
        <div class="pa-2">
          <div class="title font-weight-bold text-uppercase primary--text">{{ product.name }}</div>
        </div>
      </template> -->

      <!-- Navigation menu -->
      <main-menu :menu="navigation.menu" />

      <!-- Navigation menu footer -->
      <template v-slot:append>
        <!-- Footer navigation links -->
        <div class="pa-1 text-center">
          <v-btn
            v-for="(item, index) in navigation.footer"
            :key="index"
            :href="item.href"
            :target="item.target"
            small
            text
          >
            {{ item.key ? $t(item.key) : item.text }}
          </v-btn>
        </div>

      </template>

    </v-navigation-drawer>

    <!-- Toolbar -->
    <v-app-bar
      app
      :color="isToolbarDetached ? 'surface' : undefined"
      :flat="isToolbarDetached"
      :light="toolbarTheme === 'light'"
      :dark="toolbarTheme === 'dark'"
    >
      <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
        <div class="d-flex flex-grow-1 align-center">

          <!-- search input mobile -->
          <!-- <v-text-field
            v-if="showSearch"
            append-icon="mdi-close"
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            hide-details
            solo
            flat
            autofocus
            @click:append="showSearch = false"
          ></v-text-field> -->

          <div class="d-flex flex-grow-1 align-center">

            <v-app-bar-nav-icon
              @click.stop="drawer = !drawer"
            />

            <router-link to="/home" class="text-decoration-none d-none d-sm-flex flex-row flex-nowrap justify-center align-center mx-4">
              <img
                class="logo-main-md"

                :src="require(`@/assets/images/logos/archipelago-logo-${ toolbarTheme === 'dark' || globalTheme === 'dark' ? 'white' : 'normal' }.png`)"
                alt="ARCHIPELAGO"
              >
              <div class="logo-label-md text-center text-no-wrap ms-2">Academy</div>
            </router-link>

            <router-link to="/home" class="text-decoration-none d-sm-none flex-column flex-nowrap justify-center align-center mx-4">
              <img
                class="logo-main-sm"
                :src="require(`@/assets/images/logos/archipelago-logo-${ toolbarTheme === 'dark' || globalTheme === 'dark' ? 'white' : 'normal' }.png`)"
                alt="ARCHIPELAGO"
              >
              <div class="logo-label-sm text-center text-no-wrap">A C A D E M Y</div>
            </router-link>

            <!-- search input desktop -->
            <!-- <v-text-field
              ref="search"
              class="mx-1 hidden-xs-only"
              :placeholder="$t('menu.search')"
              prepend-inner-icon="mdi-magnify"
              hide-details
              filled
              rounded
              dense
            ></v-text-field>

            <v-btn class="d-block d-sm-none" icon @click="showSearch = true">
              <v-icon>mdi-magnify</v-icon>
            </v-btn> -->

            <v-spacer />

            <toolbar-user />

          </div>
        </div>
      </v-card>
    </v-app-bar>

    <v-main>
      <v-container :fluid="!isContentBoxed" class="pa-2 pa-md-3">
        <v-layout>
          <slot></slot>
        </v-layout>
      </v-container>

      <v-footer app inset>
        <v-spacer></v-spacer>
        <div class="overline">
          {{ product.version }} — © 2022 Archipelago International
        </div>
      </v-footer>
    </v-main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

// navigation menu configurations
import config from '../configs'

import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'

export default {
  components: {
    MainMenu,
    ToolbarUser
  },
  data() {
    return {
      drawer: null,
      showSearch: false,
      navigation: config.navigation
    }
  },
  computed: {
    ...mapState('app', ['product', 'isContentBoxed', 'globalTheme', 'menuTheme', 'toolbarTheme', 'isToolbarDetached'])
  },
  methods: {
    onKeyup(e) {
      this.$refs.search.focus()
    }
  }
}
</script>

<style lang="scss" scoped>

.logo-main-md {
  height: 24px;
}
.logo-label-md {
  font-size: 32px;
  font-weight: 400;
}

.logo-main-sm {
  height: 16px;
}
.logo-label-sm {
  font-size: 16px;
  line-height: 12px;
  font-weight: 600;
}

</style>
