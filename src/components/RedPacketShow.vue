<template>
  <div>
    <v-dialog v-model="loginDialog">
      <v-card>
        <v-card-title>
          <v-alert type="info" :value="true">
            {{ $t('login_title') }}
          </v-alert>
        </v-card-title>
        <v-card-text>
          <v-form v-model="loginForm.valid" ref="loginForm" lazy-validation>
            <v-select
              :items="countries"
              :filter="countryFilter"
              v-model="countryCode"
              item-text="name"
              item-value="code"
              :label="$t('form.country')"
              :rules="countryCodeRules"
              autocomplete
              required
            >
              <template slot="item" slot-scope="data">
                <span>{{ data.item.name }}, +{{ data.item.code }}</span>
              </template>
            </v-select>
            <v-text-field prepend-icon="mdi-cellphone-iphone" v-model="loginForm.mobile" :label="$t('form.mobile')" :rules="mobileRules" required></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="loginForm.passwd" :label="$t('form.password')" :rules="passwordRules" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="loginDialog=false;registerDialog=true">{{ $t('register') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!loginForm.valid || logining" :loading="logining" @click="submitLoginForm">{{ $t('login') }}</v-btn>
        </v-card-actions>
        <v-card-actions>
          <telegram-login 
              mode="callback"
              telegram-login="TokenmeBot"
              userpic = "true"
              @callback="telegramLoginCallback">
          </telegram-login>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="registerDialog">
      <v-card>
        <v-card-title>
          <v-alert type="info" :value="true">
            {{ $t('login_title') }}
          </v-alert>
        </v-card-title>
        <v-card-text>
          <v-form v-model="registerForm.valid" ref="registerForm" lazy-validation>
            <v-select
              :items="countries"
              :filter="countryFilter"
              v-model="countryCode"
              item-text="name"
              item-value="code"
              :label="$t('form.country')"
              :rules="countryCodeRules"
              autocomplete
              required
            >
              <template slot="item" slot-scope="data">
                <span>{{ data.item.name }}, +{{ data.item.code }}</span>
              </template>
            </v-select>
            <v-text-field prepend-icon="mdi-cellphone-iphone" v-model="registerForm.mobile" :label="$t('form.mobile')" @change="onMobileChange" :rules="mobileRules" required></v-text-field>
            <v-btn block color="primary" :loading="authSending" :disabled="smsCountdown>0 || !registerForm.mobile || !countryCode || verifing" @click="authSend">{{ authSendBtn }}</v-btn>
            <v-layout row wrap>
              <v-flex xs8 sm8>
                <v-text-field :color="registerForm.verified?'green':'red'" class="input-group--focused" prepend-icon="mdi-verified" v-model="registerForm.verify_code" :label="$t('form.verify_code')" :rules="verifyRules"></v-text-field>
              </v-flex>
              <v-flex xs4 sm4>
                <v-btn color="primary" :loading="verifing" :disabled="!registerForm.verify_code || verifing" @click="authVerify">{{ $t('auth_verify') }}</v-btn>
              </v-flex>
            </v-layout>  
            <v-text-field prepend-icon="mdi-key" v-model="registerForm.passwd" :label="$t('form.password')" :rules="passwordRules" type="password"></v-text-field>
            <v-text-field prepend-icon="mdi-key" v-model="registerForm.repasswd" :label="$t('form.repassword')" :rules="repasswordRules" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="registerDialog=false;loginDialog=true">{{ $t('login') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!registerForm.valid || registering" :loading="registering" @click="submitRegisterForm">{{ $t('register') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="hongbao-container animated zoomIn" v-if="!expired && redPacket && !redPacket.submitted_recipients">
      <div class="hongbao elevation-4">
        <div class="topcontent">
          <div class="avatar_hb">
                <img :src="redPacket.user.avatar">
            </div>
            <h2>{{ redPacket.user.showname}}</h2>
            <span class="text">{{ $t('help.cover_text') }}</span>
            <div class="description">{{ redPacket.message || $t('help.cover_message') }}</div>
        </div>
        <div class="chai" v-if="logining">
          <v-progress-circular indeterminate color="white" style="margin-top:32px"></v-progress-circular>
        </div>
        <div class="chai" v-else>
          <span @click="checkHongbao">{{ $t('open') }}</span>
        </div>
      </div>
    </div>
    <template v-else-if="redPacket">
      <div class="inner animated slideInDown">
        <div class="inner-top">
          <h2>{{ redPacket.user.showname}}</h2>
          <div class="avatar_inner">
            <img :src="redPacket.user.avatar">
          </div>
        </div>
        <div class="totalToken">
          {{ giveOutDisplayText(redPacket.total_tokens, redPacket.token.decimals) }}<sub>{{ redPacket.token.symbol }}</sub>
          <div v-if="redPacket.token && redPacket.token.price" class="price">
            ≈ {{ recepientPriceTxt(redPacket.total_tokens, redPacket.token).toFixed(4) }}{{ redPacket.token.price.currency }}
          </div>
        </div>
        <v-container class="pt-1">
          <v-layout row wrap align-center justify-center @click="gotoToken">
            <v-flex class="text-xs-right pr-2" v-if="redPacket.token.logo_address">
              <img :src="redPacket.token.logo_address" width="32" height="32"/>
            </v-flex>
            <v-flex>
              <div :class="(redPacket.token.logo_address?'text-xs-left':'') + ' headline'">{{ redPacket.token.name === 'ETH' ? 'Ethereum' : redPacket.token.name }}</div>
            </v-flex>
          </v-layout>
        </v-container>
        <div class="description">{{ redPacket.message || $t('help.cover_message') }}</div>
      </div>
      <v-container fluid grid-list-lg class="px-0">
        <v-btn block :to="{path:'/'}" color="primary" class="animated bounceIn">{{ $t('home_btn') }}</v-btn>
        <v-divide></v-divide>
        <v-list two-line v-if="redPacket.submitted_recipients" class="animated slideInUp">
          <template v-for="(recipient, index) in redPacket.submitted_recipients">
            <v-divider v-if="index>0" inset :key="'divider'+index"></v-divider>
            <v-list-tile avatar :key="recipient.id">
              <v-list-tile-avatar>
                <img :src="recipient.user.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ recipient.user.showname }}
                  <v-icon color="orange" small v-if="bestRecipient && bestRecipient.id === recipient.id">mdi-star-circle</v-icon>
                </v-list-tile-title>
                <v-list-tile-sub-title style="font-size:xx-small">{{ recipient.submitted_time }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text v-if="redPacket.token && redPacket.token.price" class="text-xs-right">
                  {{ giveOutDisplayText(recipient.give_out, recipient.decimals) }}
                  <br/>
                  ≈ {{ recepientPriceTxt(recipient.give_out, redPacket.token).toFixed(4) }}{{ redPacket.token.price.currency }}
                </v-list-tile-action-text>
                <template v-else>
                  {{ giveOutDisplayText(recipient.give_out, recipient.decimals) }}
                </template>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-container>
    </template>
  </div>
</template>

<style scoped>
  .hongbao-container {
    text-align: center;
    width: 100%;
    margin: 0 auto;
    padding: 40px 20px 80px;
    height: 100%;
    position: absolute;
    color: white;
    min-height: 500px;
  }
  .hongbao{
    height:100%;
    background: #A5423A;
    left: 0;
    top: 0;
    border-radius: 10px;
    margin: 0 auto;
  }
  .topcontent{
    height: 300px;
    border: 1px solid #BD503A;
    background-color: #BD503A;
    border-radius: 10px 10px 50% 50% / 10px 10px 15% 15%;
  }

  .avatar_hb{
    position: relative;
  }
  .avatar_hb span{
    position: absolute;
    top: 10px;
    right: 15px;
    -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
            transform: rotate(45deg);
    font-size: 2em;
    font-weight: bolder;
  }
  .avatar_hb img{
    border: 1px solid #bdbdbd;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 10%;
    width: 60px;
    height: 60px;
    border: orange solid 1px;
    background-color: lightgray;
  }
  .topcontent h2{
    margin: 15px 0;
    font-weight: normal;
  }
  .text{
    color: #bdbdbd;
  }
  .description{
    margin: 20px 0;
    font-size: 22px;
    font-weight: 600;
  }

  .chai{
    width: 100px;
    height: 100px;
    border: 1px solid #FFA73A;
    background-color: #FFA73A;
    border-radius: 50%;
    color: #fff;
    font-size: 20px;
    display: inline-block;
    margin-top: -50px;
    box-shadow: 0px 4px 0px 0px rgba(0, 0, 0, 0.2);
  }
  .chai span{
      margin-top: 35px;
      display: inline-block;
  }
  .rotate{
      -webkit-animation: anim .6s infinite alternate;
          -ms-animation: anim .6s infinite alternate;
              animation: anim .6s infinite alternate;
  }
  @-webkit-keyframes anim {
      from { -webkit-transform: rotateY(180deg); }
      to { -webkit-transform: rotateY(360deg); }
  }
  @-ms-keyframes anim {
      from { -ms-transform: rotateY(180deg); }
      to { -ms-transform: rotateY(360deg); }
  }
  @keyframes anim {
      from { transform: rotateY(180deg); }
      to { transform: rotateY(360deg); }
  }

  .inner {
    text-align: center;
    width: 100%;
    margin: 0 auto;
    background-color: #fafafa;
  }
  .inner-top{
    height: 80px;
    border: 1px solid #BD503A;
    background-color: #BD503A;
    border-radius: 0 0 80% 80%/0 0 100% 100%;
  }
  .inner-top h2{
    margin: 25px 0;
    font-weight: normal;
    font-size:13px;
    color:white;
  }

  .avatar_inner img{
    border: 1px solid #bdbdbd;
    border-radius: 50%;
    overflow: hidden;
    margin-top: -18px;
    width: 60px;
    height: 60px;
    border: orange solid 1px;
    background-color: lightgray;
  }
  .inner .description{
    margin: 10px 0;
    font-size: 16px;
    font-weight: normal;
  }
  .inner .totalToken{
    margin: 55px 0 10px 0;
    font-size: 32px;
    font-weight: 600;
  }
  .inner .totalToken sub {
    font-size:12px;
    font-weight:normal;
  }
  .inner .totalToken .price {
    font-size: 12px;
    font-weight: normal;
    color: gray;
  }
</style>

<script>
  import TelegramLogin from '../components/TelegramLogin.vue'
  import * as types from '../store/mutation-types'
  import {countries} from '../twilio-countries'
  import redPacketAPI from '../api/red-packet'
  import smsAPI from '../api/sms'
  import i18n from '../locale/rp'
  import * as util from '../util'

  export default {
    i18n: i18n,
    components: {
      'telegram-login': TelegramLogin
    },
    data() {
      return {
        loading: false,
        currentStep: 1,
        key: '',
        redPacket: null,
        submitting: false,
        submitted: false,
        loginDialog: false,
        loginForm: {
          valid: true,
          passwd: '',
          mobile: ''
        },
        registerForm: {
          valid: true,
          mobile: '',
          passwd: '',
          repasswd: '',
          verify_code: '',
          verified: false
        },
        logining: false,
        registering: false,
        countries: countries,
        countryFilter (item, queryText, itemText) {
          const hasValue = val => val != null ? val : ''
          const text = hasValue(item.name)
          const query = hasValue(queryText)
          return text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        },
        authSending: false,
        verifing: false,
        smsCountdown: 0
      }
    },
    metaInfo () {
      return {
        title: this.metaTitle,
        meta: [
          {
            name: 'description',
            content: this.$i18n.t('rp_share.desc')
          },
          {
            property: 'description',
            content: this.$i18n.t('rp_share.desc')
          },
          {
            property: 'og:title',
            content: this.redPacket ? this.$i18n.t('rp_share.title', {user: this.redPacket.user.showname, num: this.redPacket.recipients, token: this.redPacket.token.name}) : this.$i18n.t('rp_share.default')
          },
          {
            property: 'og:url',
            content: this.metaLink
          }
        ]
      }
    },
    computed: {
      metaTitle() {
        let title = this.$i18n.t('rp_share.default')
        if (this.redPacket) {
          title = this.$i18n.t('rp_share.title', {user: this.redPacket.user.showname, num: this.redPacket.recipients, token: this.redPacket.token.name})
        }
        return title
      },
      metaLink() {
        let link = ''
        if (this.redPacket) {
          link = this.redPacket.short_url || this.redPacket.link
        }
        return link
      },
      token() {
        return this.$store.getters['token']
      },
      logined() {
        return this.$store.getters['loggedIn']
      },
      user() {
        return this.$store.getters['userInfo']
      },
      countryCode: {
        get() {
          return this.$store.getters['countryCode']
        },
        set(value) {
          this.$store.dispatch(types.CHANGE_COUNTRY_CODE_REQUEST, value)
        }
      },
      authSendBtn() {
        if (this.smsCountdown <= 0) {
          return this.$i18n.t('auth_send')
        }
        return '(' + this.smsCountdown + ') ' + this.$i18n.t('auth_send')
      },
      countryCodeRules() {
        return [
          v => !!v || this.$i18n.t('error.country_code_required')
        ]
      },
      mobileRules() {
        return [
          v => !!v || this.$i18n.t('error.mobile_required'),
          v => /^\d{1,14}$/.test(v) || this.$i18n.t('error.mobile_invalid')
        ]
      },
      passwordRules() {
        return [
          v => !!v || this.$i18n.t('error.password_required')
        ]
      },
      repasswordRules() {
        return [
          v => this.registerForm.passwd === v || this.$i18n.t('error.repassword_invalid')
        ]
      },
      expired() {
        return this.redPacket && this.redPacket.status === 6
      },
      allTaken() {
        return this.redPacket && this.redPacket.status === 2
      },
      showAllTaken() {
        if (!this.redPacket || !this.redPacket.submitted_recipients) {
          return false
        }
        const telegram = JSON.parse(localStorage.getItem('telegram'))
        let alreadyTaken = false
        for (const r of this.redPacket.submitted_recipients) {
          if (this.user && r.user.id === this.user.id) {
            alreadyTaken = true
            break
          }
          if (telegram && r.user.telegram && r.user.telegram.id === telegram.id) {
            alreadyTaken = true
            break
          }
        }

        if (this.allTaken && (!this.user || this.redPacket.user_id !== this.user.id) && !alreadyTaken) {
          return true
        }
        return false
      },
      bestRecipient() {
        if (this.redPacket.submitted_recipients) {
          let best = null
          for (const rpr of this.redPacket.submitted_recipients) {
            if (!best || best.give_out < rpr.give_out) {
              best = rpr
            }
          }
          return best
        }
        return null
      }
    },
    methods: {
      giveOutDisplayText(value, decimals) {
        return value / Math.pow(10, decimals)
      },
      recepientPriceTxt(value, token) {
        if (!token.price) {
          return 0
        }
        return value / Math.pow(10, token.decimals) * token.price.rate
      },
      getRedPacket() {
        return new Promise((resolve, reject) => {
          let payload = {key: this.key}
          const telegram = JSON.parse(localStorage.getItem('telegram'))
          if (telegram) {
            payload.telegram = JSON.stringify(telegram)
          }
          redPacketAPI.show(this.token, payload).then((response) => {
            if (response && response.code) {
              reject(response)
              return
            }
            resolve(response)
          })
        })
      },
      checkHongbao() {
        if (this.logined) {
          this.logining = true
          this.submitRedPacket().then(res => {
            if (res.message === 'unlucky') {
              this.showErrorDialog({ title: this.$i18n.t('error.unlucky_title'), message: this.$i18n.t('error.unlucky_message') })
            }
            this.getRedPacket().then(res => {
              this.logining = false
              this.loginDialog = false
              this.redPacket = res
            }, err => {
              alert(err)
              this.showErrorDialog({ title: this.$i18n.t('error.submit_failed'), message: err.message })
              this.logining = false
            })
          }, err => {
            this.logining = false
            this.showErrorDialog({ title: this.$i18n.t('error.submit_failed'), message: err.message })
          })
          return
        } else if (util.isWeixinBrowser()) {
          if (this.key) {
            localStorage.setItem('share_key', this.key)
          }
          this.$router.replace('/guide?relogin=1')
          return
        }
        this.loginDialog = true
      },
      submitRedPacket() {
        return new Promise((resolve, reject) => {
          let payload = { red_packet_id: this.redPacket.id }
          const telegram = JSON.parse(localStorage.getItem('telegram'))
          if (telegram) {
            payload.telegram = JSON.stringify(telegram)
          }
          redPacketAPI.submit(this.token, payload).then((response) => {
            if (response && response.code) {
              if (response.message === 'internal error') {
                localStorage.clear()
                redPacketAPI.submit(this.token, payload).then((res) => {
                  if (res && res.code) {
                    if (res.message === 'internal error') {
                      localStorage.clear()
                      return
                    }
                    reject(res)
                    return
                  }
                  resolve(res)
                })
                return
              }
              reject(response)
              return
            }
            resolve(response)
            if (window.gtag) {
              try {
                const giveOut = parseFloat(response.message)
                window.gtag('event', 'red_packet', {'event_category': 'any', 'event_action': 'submit', 'event_label': this.redPacket.token.address, 'value': giveOut})
              } catch (e) {
                console.log(e)
              }
            }
          })
        })
      },
      telegramLoginCallback(user) {
        this.logining = true
        this.$store.dispatch(types.TELEGRAM_UPDATE_REQUEST, user)
        var runner = async() => {
          try {
            await this.$store.dispatch(types.LOGIN_REQUEST, { telegram: JSON.stringify(user) })
          } catch (e) {
            console.log(e)
          }
          this.submitRedPacket().then(res => {
            if (res.message === 'unlucky') {
              this.showErrorDialog({ title: this.$i18n.t('error.unlucky_title'), message: this.$i18n.t('error.unlucky_message') })
            }
            this.getRedPacket().then(res => {
              this.logining = false
              this.loginDialog = false
              this.redPacket = res
            }, err => {
              console.log(err)
              this.logining = false
            })
          }, err => {
            this.logining = false
            this.showErrorDialog({ title: this.$i18n.t('error.submit_failed'), message: err.message })
          })
        }
        runner()
      },
      submitLoginForm(e) {
        if (!this.$refs.loginForm.validate()) {
          return false
        }
        this.logining = true
        this.$store.dispatch(types.LOGIN_REQUEST, {
          username: this.countryCode + '.' + this.loginForm.mobile,
          password: this.loginForm.passwd
        }).then(res => {
          this.submitRedPacket().then(res => {
            if (res.message === 'unlucky') {
              this.showErrorDialog({ title: this.$i18n.t('error.unlucky_title'), message: this.$i18n.t('error.unlucky_message') })
            }
            this.getRedPacket().then(res => {
              this.logining = false
              this.loginDialog = false
              this.redPacket = res
            }, err => {
              console.log(err)
              this.logining = false
            })
          }, err => {
            this.logining = false
            this.showErrorDialog({ title: this.$i18n.t('error.submit_failed'), message: err.message })
          })
        }, err => {
          this.logining = false
          this.showErrorDialog({ title: this.$i18n.t('error.login_failed'), message: err.message })
        })
      },
      authSendCountdown() {
        let self = this
        self.smsCountdown -= 1
        if (self.smsCountdown <= 0) {
          return
        }
        setTimeout(self.authSendCountdown, 1000)
      },
      onMobileChange() {
        this.registerForm.verify_code = ''
        this.registerForm.verified = false
      },
      authSend() {
        this.authSending = true
        this.smsCountdown = 60
        smsAPI.authSend({ mobile: this.registerForm.mobile, country: this.countryCode }).then((response) => {
          this.authSending = false
          if (response.code) {
            this.smsCountdown = 0
            this.showErrorDialog({ title: this.$i18n.t('error.auth_send_failed'), message: response.message })
          } else {
            let self = this
            setTimeout(self.authSendCountdown, 1000)
          }
        })
      },
      authVerify() {
        this.verifing = true
        smsAPI.authVerify({ mobile: this.registerForm.mobile, country: this.countryCode, code: this.registerForm.verify_code }).then((response) => {
          this.verifing = false
          if (response.code) {
            this.showErrorDialog({ title: this.$i18n.t('error.auth_verify_failed'), message: response.message })
            this.registerForm.verify_code = ''
            this.registerForm.verified = false
          } else {
            this.registerForm.verified = true
            this.$refs.registerForm.validate()
          }
        })
      },
      submitRegisterForm(e) {
        if (!this.$refs.registerForm.validate()) {
          return false
        }
        this.registering = true
        this.$store.dispatch(types.REGISTER_REQUEST, {
          country_code: this.countryCode,
          mobile: this.registerForm.mobile,
          verify_code: this.registerForm.verify_code,
          passwd: this.registerForm.passwd,
          repasswd: this.registerForm.repasswd
        }).then(res => {
          this.registering = false
          this.registerDialog = false;
          this.loginDialog = true
        }, err => {
          this.showErrorDialog({ title: this.$i18n.t('error.register_failed'), message: err.message })
          this.registering = false
        })
      },
      gotoToken() {
        this.$router.push({
          path: '/token/' + (this.redPacket.token.address ? this.redPacket.token.address : 'ETH')
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
      },
      showSnackbar(msg) {
        this.$store.dispatch(types.SHOW_SNACKBAR, {message: msg})
      }
    },
    created() {
      this.key = this.$route.params.key
    },
    mounted() {
      this.toggleLoading(true)
      this.getRedPacket().then(res => {
        if (util.isWeixinBrowser() && res && res.link && res.link.indexOf('tokenmama.io') > -1) {
          location.href = res.link.replace('tokenmama.io', 'tmm.tianxi100.com')
        }
        this.toggleLoading(false)
        this.redPacket = res
        if (this.showAllTaken || this.expired) {
          this.showErrorDialog({title: this.$i18n.t('error.unlucky_title'), message: this.$i18n.t('error.unlucky_message')})
        }
      }, err => {
        console.log(err)
        this.toggleLoading(false)
        this.redPacket = null
      })
    }
  }

</script>
