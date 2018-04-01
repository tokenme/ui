<template>
  <v-app>
    <nav-drawer ref="navDrawer" @changeLocale="changeLocale"></nav-drawer>
    <loader v-if="showLoader"></loader>
    <v-dialog v-model="showErrorDialog">
      <v-card>
        <v-card-title class="headline">{{ errorDialog.title }}</v-card-title>
        <v-card-text>{{ errorDialog.message }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click.native="showErrorDialog=false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      :timeout="2000"
      multi-line
      v-model="showSnackbar"
    >
      {{ snackbar.message }}
      <v-btn dark flat @click.native="showSnackbar=false">{{ $t('close') }}</v-btn>
    </v-snackbar>
    <v-toolbar color="primary" dark app fixed v-if="!hideToolbar">
      <v-btn icon @click.stop="toggleDrawer()">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="toolbarItems">
        <v-menu bottom left>
          <v-btn icon slot="activator" dark>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="item in toolbarItems" flat :key="item.name" @click="toolbarItemClick(item)">
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
      <template v-if="toolbarIcons">
        <v-btn icon v-for="item in toolbarIcons" :loading="loading" :key="item.name" @click="toolbarItemClick(item)">
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <v-content class="white">
      <router-view></router-view>
    </v-content>
    <v-footer color="transparent" v-if="!hideFooter">
      <v-btn small block flat to="{name: 'home'}">tokenmama.io&copy;2017</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
  import NavDrawer from './components/NavDrawer.vue'
  import Loader from './components/Loader.vue'
  import { bus } from './bus'
  import {
    SELECT_LOCALE_REQUEST,
    GEOIP_REQUEST,
    HIDE_ERROR_DIALOG,
    HIDE_SNACKBAR
  } from './store/mutation-types'

  export default {
    components: {
      'nav-drawer': NavDrawer,
      'loader': Loader
    },
    data() {
      return {
        toolbarIcons: null,
        toolbarItems: null
      }
    },
    computed: {
      showLoader() {
        return this.$store.getters['loading']
      },
      showErrorDialog: {
        get() {
          return this.$store.getters['showErrDialog']
        },
        set(value) {
          this.$store.dispatch(HIDE_ERROR_DIALOG)
        }
      },
      errorDialog() {
        return this.$store.getters['errDialog']
      },
      showSnackbar: {
        get() {
          return this.$store.getters['showSnackbar']
        },
        set(value) {
          this.$store.dispatch(HIDE_SNACKBAR)
        }
      },
      snackbar() {
        return this.$store.getters['snackbar']
      },
      user() {
        return this.$store.getters['userInfo']
      },
      isPublisher() {
        return this.$store.getters['isPublisher']
      },
      locale() {
        return this.$store.getters['locale']
      },
      toolbarTitle() {
        const route = this.$route
        let title = 'Tokenmama.IO'
        if (route.meta.title) {
          title = this.$i18n.t('toolbarTitle.' + route.meta.title)
        }
        return title
      },
      hideToolbar() {
        const route = this.$route
        return route.meta && route.meta.hideToolbar
      },
      hideFooter() {
        const route = this.$route
        return route.meta && route.meta.hideFooter
      }
    },
    methods: {
      toggleDrawer() {
        this.$refs.navDrawer.toggleDrawer()
      },
      toolbarItemClick(item) {
        if (item.event) {
          bus.$emit(item.event.name, item.event.value)
        }
        if (item.goto) {
          this.$router.push(item.goto)
        }
      },
      changeLocale(locale) {
        this.$store.dispatch(SELECT_LOCALE_REQUEST, locale).then((locale) => {
          this.$i18n.locale = locale
        })
      },
      getGeoIP() {
        this.$store.dispatch(GEOIP_REQUEST).then((res) => {
          this.$i18n.locale = this.locale
        })
      }
    },
    created() {
      bus.$on('update_toolbar_items', (items) => {
        this.toolbarItems = items
      })
      bus.$on('update_toolbar_icons', (items) => {
        this.toolbarIcons = items
      })
      this.getGeoIP()
    },
    beforeDestroy() {
      bus.$off('update_toolbar_items')
      bus.$off('update_toolbar_icons')
    }
  }
</script>