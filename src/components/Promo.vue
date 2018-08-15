<template>
  <v-container v-if="isShowPage" fluid grid-list-lg>
    <v-dialog v-model="promotionLinkDialog">
      <v-card v-if="promotionLink">
        <v-card-title class="headline" v-if="promotionLink">{{ $t('promote_btn') }}</v-card-title>
        <v-card-text v-if="promotionLink">
          <v-btn block
            v-clipboard:copy="promotionLink"
            v-clipboard:success="onCopySuccess">{{ $t('promo_link_msg') }}</v-btn>
        </v-card-text>
        <v-card-text v-else>
          {{ $t('promo_link_alert') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="promotionLinkDialog=false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card color="red darken-3" class="white--text mb-3" v-if="promo && promo.airdrop">
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex>
            <div class="headline"><v-icon small color="white">mdi-airballoon</v-icon>{{ promo.airdrop.token.name }}</div>
          </v-flex>
          <v-flex>
            <v-card color="red darken-2" class="white--text mx-2 mt-2 mb-2 pt-4 pb-4">
              <h2 class="text-xs-center" style="font-size:2em">{{ promo.airdrop.give_out }}<sup style="font-size:0.5em;top:-1.5em">{{ promo.airdrop.token.symbol }}</sup></h2>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-btn small flat class="white--text text--lighten-4 mb-1" style="text-transform:none;margin:0" :href="promo.airdrop.token.protocol=='ERC20'?('https://etherscan.io/token/' + promo.airdrop.token.address):promo.airdrop.token.website">
              {{ promo.airdrop.token.protocol=='ERC20'?promo.airdrop.token.address:promo.airdrop.token.website }}<v-icon color="white" small>mdi-arrow-right-bold-circle</v-icon>
            </v-btn>
        </v-layout>
      </v-container>
    </v-card>
    <v-divide></v-divide>
    <v-card v-if="airdropDescription">
      <v-container fluid>
        <p v-html="airdropDescription" style="line-height:1.8em"></p>
      </v-container>
    </v-card>
    <v-btn block color="success" @click.native="promotionLinkDialog=true" v-if="promo && promo.airdrop">{{ promo.airdrop.token.protocol==='ERC20' ? $t('promote_btn_with_amount', {amount: promo.airdrop.bonus + '%'}) : $t('promote_btn') }}</v-btn>
    <v-divide></v-divide>
    <h3 class="text-xs-center" v-if="finished">{{ $t('finished') }}</h3>
    <h3 class="text-xs-center" v-else-if="notStart">{{ $t('not_start') }}</h3>
    <h3 class="text-xs-center" v-else-if="stopped">{{ $t('stopped') }}</h3>
    <h3 class="text-xs-center" v-else-if="notAvailable">{{ $t('not_available') }}</h3>
    <v-stepper vertical non-linear v-model="currentStep" v-else-if="promo && promo.verify_code">
      <v-stepper-step :step="steps.email" :complete="email != ''" editable v-if="promo.airdrop.require_email">
        {{ $t('input_email_title') }}
      </v-stepper-step>
      <v-stepper-content :step="steps.email">
        <v-text-field prepend-icon="mdi-email" v-model="email" :label="$t('email_label')" :disabled="submitted" required></v-text-field>
      </v-stepper-content>
      <v-stepper-step :step="steps.wallet" :complete="wallet != '' && submitted" editable>
        {{ $t('input_wallet_title', {wallet: walletName}) }}
        <small>{{ $t('input_wallet_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-content :step="steps.wallet">
        <template v-if="promo.airdrop.token.client_ios || promo.airdrop.token.client_android">
          <v-alert :value="true" outline color="warning" icon="priority_high">
            {{ $t('download_subtitle', {symbol: promo.airdrop.token.protocol, wallet: walletName}) }}
          </v-alert>
          <v-btn v-if="promo.airdrop.token.client_ios" small :href="promo.airdrop.token.client_ios" style="text-transform:none">
            <v-icon>mdi-apple</v-icon>
            {{ $t('download_client', {client: 'iOS'}) }}
          </v-btn>
          <v-btn v-if="promo.airdrop.token.client_android" small :href="promo.airdrop.token.client_android" style="text-transform:none">
            <v-icon>mdi-android</v-icon>
            {{ $t('download_client', {client: 'Android'}) }}
          </v-btn>
        </template>
        <v-text-field prepend-icon="mdi-wallet" v-model="wallet" :label="$t('wallet_label', {wallet: walletName})" :disabled="submitted" required></v-text-field>
        <code v-if="privateKey">{{ $t('private_key_txt', {key: privateKey}) }}</code>
        <v-btn v-if="!submitted && promo.airdrop.token.protocol=='ERC20'" small flat 
          color="primary" 
          :loading="gettingWallet" 
          @click.native="createNewWallet" 
          style="text-transform:none">
          {{ $t('create_new_wallet') }}
        </v-btn>
        <v-btn v-if="!submitted" 
          color="primary" 
          :loading="submitting" 
          @click.native="onPromoSubmition">
          {{ $t('submit') }}
        </v-btn>
      </v-stepper-content>
      <v-stepper-step :step="steps.code" :complete="copyedCode" editable>
        {{ $t('copy_code_title') }}
        <small>{{ $t('copy_code_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-content :step="steps.code">
        <v-btn depressed block color="success" dark style="text-transform:none"
          v-clipboard:copy="'/'+promo.verify_code+'@'+promo.airdrop.telegram_bot"
          v-clipboard:success="onCopySuccess">
          /{{ promo.verify_code }}@{{ promo.airdrop.telegram_bot }}
        </v-btn>
      </v-stepper-content>
      <v-stepper-step :step="steps.joinTelegram" editable>
        {{ $t('join_telegram_group_title') }}
        <small>{{ $t('join_telegram_group_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-content :step="steps.joinTelegram">
        <v-btn depressed block color="primary" style="text-transform:none" :href="'https://t.me/'+promo.airdrop.telegram_group">
          {{ $t('telegram') }}: https://t.me/{{ promo.airdrop.telegram_group }}
        </v-btn>
        <v-btn depressed block color="primary" style="text-transform:none" :href="'https://0.plus/'+promo.airdrop.telegram_group">
          {{ $t('biyong') }}: https://0.plus/{{ promo.airdrop.telegram_group }}
        </v-btn>
      </v-stepper-content>
      <v-stepper-step :step="steps.verifyTelegram">
        {{ $t('verify_in_telegram_group_title') }}
        <small>{{ $t('verify_in_telegram_group_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-step :step="steps.waitTransaction">
        {{ $t('wait_for_transaction_title') }}
        <small>{{ promo.airdrop.token.protocol=='ERC20'?$t('wait_for_transaction_subtitle', {wallet: 'ETH'}): $t('wait_for_transaction_subtitle2', {wallet: walletName}) }}</small>
      </v-stepper-step>
      <v-stepper-step :step="steps.checkMore" editable>
        {{ $t('check_more_title') }}
      </v-stepper-step>
      <v-stepper-content :step="steps.checkMore">
        <v-btn small href="/">{{ $t('login') }}</v-btn> Tokenmama.io {{ $t('check_more_message') }}
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import * as types from '../store/mutation-types'
  import promotionAPI from '../api/promotion'
  import i18n from '../locale/promo'
  const PROMO_PAGE_STATIC = 'https://static.tianxi100.com/tmm/promotions/'

  export default {
    i18n: i18n,
    data() {
      return {
        isShowPage: false,
        loading: false,
        currentStep: 1,
        key: '',
        promo: null,
        email: '',
        wallet: '',
        privateKey: '',
        copyedCode: false,
        gettingWallet: false,
        promotionLink: '',
        submitting: false,
        submitted: false,
        promotionLinkDialog: false,
        promotionLinkAlert: false
      }
    },
    computed: {
      locale() {
        return this.$store.getters['locale']
      },
      airdropDescription() {
        if (this.promo && this.promo.airdrop && this.promo.airdrop.intro) {
          const intro = JSON.parse(this.promo.airdrop.intro)
          if (intro && intro[this.locale]) return intro[this.locale]
        }
        return ''
      },
      walletName() {
        if (this.promo && this.promo.airdrop && this.promo.airdrop.token) {
          switch (this.promo.airdrop.token.protocol) {
            case 'GDW': return 'G Wallet'
            default: return 'ETH'
          }
        }
        return 'ETH'
      },
      stopped() {
        return this.promo && this.promo.airdrop && this.promo.airdrop.status === 0
      },
      notStart() {
        return this.promo && this.promo.airdrop && this.promo.airdrop.status === 2
      },
      finished() {
        return this.promo && this.promo.airdrop && this.promo.airdrop.status === 3
      },
      notAvailable() {
        return !this.promo || !this.promo.airdrop || !this.promo.verify_code
      },
      steps() {
        if (this.promo && this.promo.airdrop && this.promo.airdrop.require_email) {
          return {
            email: 1,
            wallet: 2,
            code: 3,
            joinTelegram: 4,
            verifyTelegram: 5,
            waitTransaction: 6,
            checkMore: 7
          }
        }
        return {
          wallet: 1,
          code: 2,
          joinTelegram: 3,
          verifyTelegram: 4,
          waitTransaction: 5,
          checkMore: 6
        }
      }
    },
    methods: {
      onCopySuccess(e) {
        this.showSnackbar(this.$i18n.t('copied', { txt: e.text }))
        this.copyedCode = true
        this.currentStep = this.steps.joinnTelegram
      },
      createNewWallet() {
        this.gettingWallet = true
        promotionAPI.wallet().then((response) => {
          this.gettingWallet = false
          if (response && response.code) {
            this.showSnackbar(response.message)
            return
          }
          this.wallet = response.public_key
          this.privateKey = response.private_key
        })
      },
      getPromo() {
        return new Promise((resolve, reject) => {
          promotionAPI.show(this.key).then((response) => {
            if (response && response.code) {
              reject(response)
              return
            }
            resolve(response)
          })
        })
      },
      onPromoSubmition() {
        if (!this.wallet) {
          return
        }
        if (this.promo.airdrop.token.protocol === 'ERC20' && (this.wallet.length !== 42 || this.wallet.indexOf('0x') !== 0)) {
          this.showSnackbar(this.$i18n.t('error.invalid_wallet'))
          return
        }
        const payload = {
          verify_code: this.promo.verify_code,
          wallet: this.wallet,
          email: this.email,
          proto: this.key
        }
        this.submitting = true
        promotionAPI.submit(payload).then((response) => {
          this.submitting = false
          if (response && response.code) {
            this.showSnackbar(response.message)
            return
          }
          if (response.verify_code) {
            this.promo.verify_code = response.verify_code
          }
          this.promotionLink = response.link
          this.submitted = true
          this.currentStep = this.steps.code
          this.promotionLinkDialog = true
        })
      },
      toggleLoading(v) {
        let state = types.HIDE_LOADING
        if (v) {
          state = types.SHOW_LOADING
        }
        this.$store.dispatch(state)
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
      this.getPromo().then(res => {
        this.toggleLoading(false)
        this.promo = res
        if (res.airdrop && res.airdrop.promotion_page) {
          location.href = PROMO_PAGE_STATIC + res.airdrop.promotion_page;
        } else {
          this.isShowPage = true
        }
      }, err => {
        console.log(err)
        this.toggleLoading(false)
        this.promo = null
      })
    }
  }

</script>
