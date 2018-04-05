<template>
  <v-app>
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
    <v-toolbar color="primary" dark app fixed v-if="showToolbar">
      <v-btn icon @click.stop="goback()" v-if="showGoback">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ toolbarTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer app color="transparent" v-if="showFooter">
      <v-bottom-nav absolute :value="true" :active.sync="currentTab" color="white" v-if="showTab">
        <v-btn flat color="primary" value="cash">
          <span>{{ $t('tabs.fund') }}</span>
          <v-icon>mdi-currency-usd</v-icon>
        </v-btn>
        <v-btn flat color="primary" value="addRedPacket">
          <span>{{ $t('tabs.createRedPacket') }}</span>
          <v-icon>mdi-wallet-giftcard</v-icon>
        </v-btn>
        <v-btn flat color="primary" value="userInfo">
          <span>{{ $t('tabs.account') }}</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-bottom-nav>
      <v-btn small block flat :to="{path:'/'}" v-else>tokenmama.io&copy;2017</v-btn>
    </v-footer>
  </v-app>
</template>

<script>
  import {
    SELECT_LOCALE_REQUEST,
    GEOIP_REQUEST,
    HIDE_ERROR_DIALOG,
    HIDE_SNACKBAR
  } from './store/mutation-types'
  import Loader from './components/Loader.vue'
  import { bus } from './bus'

  export default {
    components: {
      'loader': Loader
    },
    data() {
      return {
        currentTab: 'cash',
        showGoback: false
      }
    },
    watch: {
      currentTab(newVal, oldVal) {
        this.$router.push({
          name: newVal
        })
      }
    },
    computed: {
      showLoader() {
        return this.$store.getters['loading']
      },
      locale() {
        return this.$store.getters['locale']
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
      toolbarTitle() {
        const route = this.$route
        let title = 'Tokenmama.IO'
        if (route.meta.title) {
          title = this.$i18n.t('toolbarTitle.' + route.meta.title)
        }
        return title
      },
      showToolbar() {
        const route = this.$route
        return route.meta && route.meta.showToolBar
      },
      showTab() {
        const route = this.$route
        return route.meta && route.meta.showTab
      },
      showFooter() {
        const route = this.$route
        return route.meta && (route.meta.showTab || route.meta.showFooter)
      }
    },
    methods: {
      changeLocale(locale) {
        this.$store.dispatch(SELECT_LOCALE_REQUEST, locale).then((locale) => {
          this.$i18n.locale = locale
        })
      },
      getGeoIP() {
        this.$store.dispatch(GEOIP_REQUEST).then((res) => {
          this.$i18n.locale = this.locale
        })
      },
      goback() {
        this.$router.back()
      }
    },
    created() {
      this.$vuetify.theme.primary = '#E91E63'
      bus.$on('changeLocale', (locale) => {
        this.changeLocale(locale)
      })
      bus.$on('changeTab', (tab) => {
        this.currentTab = tab
      })
      bus.$on('showGoback', (goback) => {
        this.showGoback = goback
      })
      this.getGeoIP()
    }
  }
</script>