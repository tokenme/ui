<template>
  <v-navigation-drawer app fixed v-model="drawer">
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar @click="gotoLogin">
          <v-list-tile-avatar>
            <template v-if="logined">
              <img :src="user.avatar">
            </template>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-if="logined">{{ user.showname }}</v-list-tile-title>
            <v-list-tile-title v-else>{{ $t('login') }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-divider></v-divider>
    <v-list class="pt-0" dense>
      <v-list-tile v-for="menu in menus" :key="menu.title" @click="onMenuClick(menu)">
        <v-list-tile-action>
          <v-icon>{{ menu.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile>
        <v-list-tile-content>
          <v-select :items="languages" v-model="locale" :label="$t('language')" prepend-icon="mdi-translate" item-text="text" item-value="value" single-line bottom></v-select>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <div class="mt-5 text-xs-center">
      <img src="https://static.tianxi100.com/img/logo/200x200.png" width="60"/>
    </div>
  </v-navigation-drawer>
</template>

<script>
  import * as types from '../store/mutation-types'
  import i18n from '../locale/nav-drawer'

  export default {
    i18n: i18n,
    data () {
      return {
        drawer: false,
        languages: [
          { text: 'English', value: 'en' },
          { text: '繁體中文', value: 'zh_TW' },
          { text: '简体中文', value: 'zh_CN' }
        ]
      }
    },
    computed: {
      logined() {
        return this.$store.getters['loggedIn']
      },
      user() {
        return this.$store.getters['userInfo']
      },
      locale: {
        get() {
          return this.$store.getters['locale']
        },
        set(value) {
          this.$emit('changeLocale', value)
        }
      },
      menus() {
        return [
          { title: this.$i18n.t('airdrop'), icon: 'mdi-airballoon', router: 'airdrops' },
          //{ title: this.$i18n.t('promotion'), icon: 'mdi-share-variant', router: 'promotions' },
          { title: this.$i18n.t('red-packets'), icon: 'mdi-wallet-giftcard', href: 'https://tokenmama.io/rp.html' },
          { title: this.$i18n.t('channel'), icon: 'mdi-format-list-bulleted', router: 'channels' },
          { title: this.$i18n.t('fund'), icon: 'mdi-wallet', router: 'fund' },
          { title: this.$i18n.t('logout'), icon: 'mdi-exit-to-app', router: 'logout' }
        ]
      }
    },
    methods: {
      logout() {
        this.$store.dispatch(types.LOGOUT_REQUEST).then(res => {
          this.$router.push({
            name: 'login'
          })
        }, () => {
          this.$router.push({
            name: 'login'
          })
        })
      },
      toggleDrawer() {
        this.drawer = !this.drawer
      },
      onMenuClick(val) {
        this.toggleDrawer()
        if (val.router === 'logout') {
          this.logout()
          return false
        }
        if (val.href) {
          window.location = val.href
          return
        }
        this.$router.push({
          name: val.router
        })
      },
      gotoLogin() {
        this.toggleDrawer()
        if (this.logined) {
          this.$router.push({
            name: 'userInfo'
          })
          return
        }
        this.$router.push({
          name: 'login'
        })
      }
    }
  }
</script>