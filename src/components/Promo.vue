<template>
  <v-container fluid grid-list-lg>
    <v-card color="red darken-3" class="white--text mb-3" v-if="promo && promo.airdrop">
      <v-container fluid grid-list-lg>
        <v-layout row>
          <v-flex xs5>
            <div class="headline"><v-icon small color="white">mdi-airballoon</v-icon>{{ promo.airdrop.token.name }}</div>
          </v-flex>
          <v-flex xs7>
            <v-card color="red darken-2" class="white--text mx-2 mt-2 mb-2 pt-4 pb-4">
              <h2 class="text-xs-center">{{ promo.airdrop.give_out }}<sup>{{ promo.airdrop.token.symbol }}</sup></h2>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-btn small flat class="white--text text--lighten-4 mb-1" style="text-transform:none" :href="'https://etherscan.io/token/' + promo.airdrop.token.address">
              {{ promo.airdrop.token.address }}<v-icon color="white" small>mdi-arrow-right-bold-circle</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <v-alert type="info" :value="true">
      <v-btn small href="/">{{ $t('login') }}</v-btn> Tokenmama.io {{ $t('check_more_message') }}
    </v-alert>
    <v-divide></v-divide>
    <h3 class="text-xs-center" v-if="finished">{{ $t('finished') }}</h3>
    <h3 class="text-xs-center" v-else-if="notStart">{{ $t('not_start') }}</h3>
    <h3 class="text-xs-center" v-else-if="stopped">{{ $t('stopped') }}</h3>
    <h3 class="text-xs-center" v-else-if="notAvailable">{{ $t('not_available') }}</h3>
    <v-stepper vertical non-linear v-model="currentStep" v-else-if="promo && promo.verify_code">
      <v-stepper-step step="1" :complete="wallet != '' && submitted" editable>
        {{ $t('input_wallet_title') }}
        <small>{{ $t('input_wallet_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-text-field prepend-icon="mdi-wallet" v-model="wallet" :label="$t('wallet_label')" :disabled="submitted" required></v-text-field>
        <code v-if="privateKey">{{ $t('private_key_txt', {key: privateKey}) }}</code>
        <v-btn v-if="!submitted" small flat 
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
      <v-stepper-step step="2" :complete="copyedCode" editable>
        {{ $t('copy_code_title') }}
        <small>{{ $t('copy_code_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-btn depressed block color="success" dark style="text-transform:none"
          v-clipboard:copy="'/'+promo.verify_code+'@'+promo.airdrop.telegram_bot"
          v-clipboard:success="onCopySuccess">
          /{{ promo.verify_code }}@{{ promo.airdrop.telegram_bot }}
        </v-btn>
      </v-stepper-content>
      <v-stepper-step step="3" editable>
        {{ $t('join_telegram_group_title') }}
        <small>{{ $t('join_telegram_group_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-btn depressed block color="primary" style="text-transform:none" :href="'https://t.me/'+promo.airdrop.telegram_group">
          https://t.me/{{ promo.airdrop.telegram_group }}
        </v-btn>
      </v-stepper-content>
      <v-stepper-step step="4">
        {{ $t('verify_in_telegram_group_title') }}
        <small>{{ $t('verify_in_telegram_group_subtitle') }}</small>
      </v-stepper-step>
      <v-stepper-content step="4"></v-stepper-content>
      <v-stepper-step step="5">
        {{ $t('wait_for_transaction_title') }}
        <small>{{ $t('wait_for_transaction_subtitle') }}</small>
      </v-stepper-step>
    </v-stepper>
  </v-container>
</template>

<script>
  import * as types from '../store/mutation-types'
  import promotionAPI from '../api/promotion'
  import i18n from '../locale/promo'

  export default {
    i18n: i18n,
    data() {
      return {
        loading: false,
        currentStep: 1,
        key: '',
        promo: null,
        wallet: '',
        privateKey: '',
        copyedCode: false,
        gettingWallet: false,
        submitting: false,
        submitted: false
      }
    },
    computed: {
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
      }
    },
    methods: {
      onCopySuccess(e) {
        this.showSnackbar(this.$i18n.t('copied', { txt: e.text }))
        this.copyedCode = true
        this.currentStep = 3
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
        if (this.wallet.length !== 42 || this.wallet.indexOf('0x') !== 0) {
          this.showSnackbar(this.$i18n.t('error.invalid_wallet'))
          return
        }
        const payload = {
          verify_code: this.promo.verify_code,
          wallet: this.wallet
        }
        this.submitting = true
        promotionAPI.submit(payload).then((response) => {
          this.submitting = false
          if (response && response.code) {
            this.showSnackbar(response.message)
            return
          }
          this.submitted = true
          this.currentStep = 2
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
      }, err => {
        console.log(err)
        this.toggleLoading(false)
        this.promo = null
      })
    }
  }

</script>