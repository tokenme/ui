<template>
  <v-layout fill-height>
    <v-flex xs12 fill-height>
      <loadmore 
        :top-method="topRefresh" 
        :topPullText="$t('loadmore.topPullText')"
        :topDropText="$t('loadmore.releaseText')"
        :topLoadingText="$t('loadmore.loadingText')"
        ref="loadmore">
        <v-list v-if="user" two-line>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="user.avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>+{{ user.country_code}}{{ user.mobile}}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('mobile') }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar v-if="!editing.realname" @click="editing.realname = !editing.realname">
            <v-list-tile-avatar>
              <v-icon>mdi-clipboard-account</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.realname}}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('realname') }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-text-field v-else 
              v-model="editUserInfoForm.realname" 
              :label="$t('realname')" 
              prepend-icon="mdi-pencil"
              :loading="updating.realname" 
              :disabled="updating.realname" 
              :append-icon="updating.realname ? 'mdi-loading' : (editUserInfoForm.realname != user.realname ? 'mdi-check':'mdi-close')" 
              :append-icon-cb="() => (onUpdateUserInfo('realname'))" 
              @change="onUpdateUserInfo('realname')" 
              @blur="onUpdateUserInfo('realname')"></v-text-field>
          <v-divider></v-divider>
          <v-list-tile avatar v-if="!editing.email" @click="editing.email = !editing.email">
            <v-list-tile-avatar>
              <v-icon>mdi-email</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ user.email}}</v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('email') }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-text-field v-else 
              v-model="editUserInfoForm.email" 
              :label="$t('email')" 
              prepend-icon="mdi-email"
              :loading="updating.email" 
              :disabled="updating.email" 
              :append-icon="updating.email ? 'mdi-loading' : (editUserInfoForm.email != user.email ? 'mdi-check':'mdi-close')" 
              :append-icon-cb="() => (onUpdateUserInfo('email'))" 
              @change="onUpdateUserInfo('email')" 
              @blur="onUpdateUserInfo('email')"></v-text-field>
          <v-divider></v-divider>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon>mdi-telegram</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title style="height:32px;line-height:32px">
                <telegram-login 
                    mode="callback"
                    telegram-login="TokenmeBot"
                    size = "medium"
                    userpic = "true"
                    @callback="telegramLoginCallback" v-if="!user.telegram">
                </telegram-login>
                <v-btn small flat v-else-if="user.telegram && user.telegram.username" :href="'https://t.me/' + user.telegram.username">
                  {{ user.telegram.username }}
                </v-btn>
                <template v-else-if="user.telegram">{{ user.telegram.firstname}} {{ user.telegram.lastname }}</template>
              </v-list-tile-title>
              <v-list-tile-sub-title>{{ $t('telegram') }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile>
            <v-list-tile-content>
              <v-select :items="languages" v-model="locale" :label="$t('language')" prepend-icon="mdi-translate" item-text="text" item-value="value" single-line bottom></v-select>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar :to="{name:'fund'}">
            <v-list-tile-avatar>
              <v-icon>mdi-wallet</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('check_fund') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar :to="{name:'redPackets'}">
            <v-list-tile-avatar>
              <v-icon>mdi-history</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('redpackets') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider></v-divider>
          <v-list-tile avatar :to="{name:'faq'}">
            <v-list-tile-avatar>
              <v-icon>mdi-help-circle</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ $t('faq') }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <div v-html="telegramBtn"></div>
      </loadmore>
    </v-flex>
  </v-layout>
</template>

<script>
  import Loadmore from '../components/Loadmore.vue'
  import TelegramLogin from '../components/TelegramLogin.vue'
  import * as types from '../store/mutation-types'
  import userAPI from '../api/user'
  import i18n from '../locale/user-info'
  import { bus } from '../bus'
  import * as util from '../util'

  export default {
    i18n: i18n,
    components: {
      'loadmore': Loadmore,
      'telegram-login': TelegramLogin
    },
    data () {
      return {
        languages: [
          { text: 'English', value: 'en' },
          { text: '繁體中文', value: 'zh_TW' },
          { text: '简体中文', value: 'zh_CN' }
        ],
        editing: {
          realname: false,
          email: false
        },
        updating: {
          realname: false,
          email: false
        },
        editUserInfoForm: {
          realname: '',
          email: ''
        }
      }
    },
    computed: {
      user() {
        return this.$store.getters['userInfo']
      },
      token() {
        return this.$store.getters['token']
      },
      locale: {
        get() {
          return this.$store.getters['locale']
        },
        set(value) {
          bus.$emit('changeLocale', value)
        }
      }
    },
    methods: {
      topRefresh(id) {
        this.getUser(() => { 
          this.$refs.loadmore.onTopLoaded(id) 
        })
      },
      telegramLoginCallback(user) {
        const payload = {
          telegram: JSON.stringify(user)
        }
        userAPI.bindTelegram(this.token, payload).then((response) => {
          if (response.code) {
            this.showErrorDialog({ title: this.$i18n.t('error.update_failed'), message: response.message })
          } else {
            this.getUser()
          }
        })
      },
      syncEditingUserData() {
        this.editUserInfoForm.realname = this.user.realname
        this.editUserInfoForm.email = this.user.email
      },
      getUser(cb) {
        this.$store.dispatch(types.USER_INFO_REQUEST, true).then(res => {
          this.toggleLoading(false)
          this.syncEditingUserData()
          if (cb) {
            cb()
          }
        }, err => {
          this.toggleLoading(false)
          if ((err.code === 401 || err.code === 403) && util.isWeixinBrowser()) {
            localStorage.clear()
            this.$router.replace('/guide?relogin=1')
            return
          }
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.showErrorDialog({ title: this.$i18n.t('failed_title'), message: err.message })
          if (cb) {
            cb()
          }
        })
      },
      onUpdateUserInfo(field) {
        if (this.updating[field]) {
          return
        }
        const fieldValue = this.editUserInfoForm[field]
        let oldValue = this.user[field]
        if (fieldValue === oldValue) {
          this.updating[field] = false
          this.editing[field] = false
          return
        }
        let payload = {
          realname: '',
          email: ''
        }
        payload[field] = fieldValue
        this.updating[field] = true
        userAPI.update(this.token, payload).then((response) => {
          this.updating[field] = false
          this.editing[field] = false
          if (response.code) {
            this.showErrorDialog({ title: this.$i18n.t('error.update_failed'), message: response.message })
          } else {
            this.getUser()
          }
        })
      },
      toggleLoading(v) {
        let state = types.HIDE_LOADING
        if (v) {
          state = types.SHOW_LOADING
        }
        this.$store.dispatch(state)
      },
      showErrorDialog(err) {
        this.$store.dispatch(types.SHOW_ERROR_DIALOG, err)
      }
    },
    mounted() {
      this.syncEditingUserData()
      bus.$emit('changeTab', 'userInfo')
      bus.$emit('showGoback', false)
      bus.$emit('update_toolbar_icons', null)
      bus.$emit('update_toolbar_items', null)
    }
  }
</script>
