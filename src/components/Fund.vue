<template>
  <v-container fluid fill-height class="px-0 pt-0">
    <v-bottom-sheet v-model="actionSheet">
      <v-list>
        <v-list-tile :to="{path:'/token/'+(actionFund.token.name==='ETH'?'ETH':actionFund.token.address)}" v-if="actionFund && actionFund.token.price">
          <v-list-tile-avatar>
            <v-icon>mdi-information</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('token_details') }}</v-list-tile-title>
        </v-list-tile>
        <v-divider v-if="actionFund && actionFund.token.price"></v-divider>
        <v-list-tile @click="onCreateRedPacket">
          <v-list-tile-avatar>
            <v-icon>mdi-wallet-giftcard</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('create_red_packet') }}</v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="onTransferIn">
          <v-list-tile-avatar>
            <v-icon>mdi-arrow-left</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('transfer_in') }}</v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="onTransfer">
          <v-list-tile-avatar>
            <v-icon>mdi-transfer</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('transfer') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-bottom-sheet>
    <v-dialog v-model="walletDialog">
      <v-card v-if="userWallet">
        <v-card-title>
          <v-btn small block
            v-clipboard:copy="userWallet.wallet"
            v-clipboard:success="onCopySuccess" style="text-transform:none">{{ userWallet.wallet }}</v-btn>
          <span class="grey--text">{{ $t('help.wallet_address') }}</span>
        </v-card-title>
        <v-card-text>
          <qrcode size="200" :value="userWallet.wallet" class="text-xs-center"></qrcode>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="walletDialog=false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="redPacketDialog">
      <v-card v-if="actionFund">
        <v-card-title>
          {{ $t('create_red_packet_title', {token: actionFund.token.name }) }}
        </v-card-title>
        <v-card-text>
          <v-form v-model="newRedpacketForm.valid" ref="newRedpacketForm" lazy-validation>
            <v-text-field 
              v-model="newRedpacketForm.total_tokens" 
              :label="$t('total_tokens_label')" 
              :prepend-icon="actionFund.token.name==='ETH'?'mdi-currency-eth':'mdi-coins'"
              :suffix="actionFund.token.name==='ETH'?'Ether':''" 
              :rules="totalTokenRules" 
              :hint="tokenPriceHint"
              required></v-text-field>
            <v-text-field v-model="newRedpacketForm.recipients" :label="$t('recipients_label')" prepend-icon="mdi-airballoon" :rules="recipientRules" required></v-text-field>
            <v-text-field v-model="newRedpacketForm.message" :label="$t('message_label')" :rules="messageRules"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="redPacketDialog=false">{{ $t('close') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!newRedpacketForm.valid || creatingRedPacket" :loading="creatingRedPacket" @click="submitNewRedPacketForm">{{ $t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="passwordDialog">
      <v-card>
        <v-card-text>
          <v-form v-model="passwordForm.valid" ref="passwordForm" lazy-validation>
            <v-text-field prepend-icon="mdi-key" v-model="passwordForm.passwd" :label="$t('form.password')" :rules="passwordRules" type="password"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="passwordDialog=false">{{ $t('close') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!passwordForm.valid || exporting" :loading="exporting" @click="exportPrivateKey">{{ $t('submit') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="privateKeyDialog">
      <v-card v-if="privateKeyResponse">
        <v-card-title class="headline">{{ $t('privatekey_response_title') }}</v-card-title>
        <v-card-text>
          <v-btn block
            v-clipboard:copy="privateKeyResponse.priv"
            v-clipboard:success="onCopySuccess">{{ $t('privatekey_response_msg') }}</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="privateKeyDialog=false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <loadmore 
      :top-method="topRefresh" 
      :topPullText="$t('loadmore.topPullText')"
      :topDropText="$t('loadmore.releaseText')"
      :topLoadingText="$t('loadmore.loadingText')"
      ref="loadmore">
      <v-container v-if="!cashOnly">
        <v-card v-if="userWallet" color="blue darken-2" class="white--text">
          <v-card-title primary-title>
            <div class="headline">
              {{ userWallet.name }}
              <v-chip v-if="userWallet.is_main==1" small label color="red" text-color="white">
                {{ $t('main')}}
              </v-chip>
            </div>
          </v-card-title>
          <v-card-actions>
            <span style="font-size:50%">≈</span> {{ fundMoney(walletOnly ? 'wallet' : '').toFixed(4) }}<sub style="font-size:50%">USD</sub>
            <v-spacer></v-spacer>
            <v-btn flat icon color="white" @click.native="walletDialog=true"><v-icon>mdi-qrcode</v-icon></v-btn>
            <v-btn color="warning" @click.native="passwordDialog=true" v-if="userWallet.is_private==1">{{ $t('export_private_key') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
      <v-container v-if="cashOnly">
        <v-card v-if="userWallet" color="blue darken-2" class="white--text">
          <v-card-title primary-title class="d-block">
            <div class="headline text-xs-center">
              <span style="font-size:50%">≈</span> {{ fundMoney(cashOnly?'cash':'wallet').toFixed(4) }}<sub style="font-size:50%">USD</sub>
            </div>
          </v-card-title>
        </v-card>
      </v-container>
      <v-list two-line>
        <v-subheader>{{ $t('help.redpacket')}}</v-subheader>
        <template v-for="(fund, index) in funds">
          <v-divider v-if="index > 0"></v-divider>
          <v-list-tile avatar :key="fund.token.address" @click="onTokenClick(fund)">
            <v-list-tile-avatar>
              <img :src="fund.token.logo_address" v-if="fund.token.logo_address">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ fundValueTxt(fund, cashOnly ? 'cash' : '') }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ (cashOnly || walletOnly) ? fund.token.name : ($t('cash') + ': ' + fundValueTxt(fund, 'cash')) }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text class="text-xs-right">
                {{ (cashOnly || walletOnly) ? '' : fund.token.name }}<v-chip label small class="mr-0">{{ fund.token.symbol }}</v-chip>
                <template v-if="fund.token.price">
                  <br/>
                  ≈ {{ fundPriceTxt(fund, cashOnly?'cash':(walletOnly?'wallet':'')).toFixed(4) }}{{ fund.token.price.currency }}
                </template>
              </v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </loadmore>
  </v-container>
</template>

<script>
  import Loadmore from '../components/Loadmore.vue'
  import VQrcode from 'v-qrcode'
  import * as types from '../store/mutation-types'
  import userAPI from '../api/user'
  import redPacketAPI from '../api/red-packet'
  import i18n from '../locale/funds'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    components: {
      'loadmore': Loadmore,
      'qrcode': VQrcode
    },
    data() {
      return {
        exporting: false,
        creatingRedPacket: false,
        walletDialog: false,
        passwordDialog: false,
        privateKeyDialog: false,
        redPacketDialog: false,
        privateKeyResponse: null,
        newRedpacketForm: {
          valid: true,
          message: '',
          total_tokens: 0,
          recipients: 0
        },
        passwordForm: {
          valid: true,
          passwd: ''
        },
        actionSheet: false,
        actionFund: null
      }
    },
    props: {
      cashOnly: false,
      walletOnly: false
    },
    computed: {
      userWallet() {
        return this.$store.getters['funds']
      },
      funds() {
        return this.userWallet ? this.userWallet.funds : []
      },
      token() {
        return this.$store.getters['token']
      },
      passwordRules() {
        return [
          v => !!v || this.$i18n.t('error.password_required')
        ]
      },
      messageRules() {
        return [
          v => v.length <= 20 || this.$i18n.t('error.message_less_than_20')
        ]
      },
      recipientRules() {
        return [
          v => parseInt(v) > 0 || this.$i18n.t('error.number_required'),
          v => parseInt(v) <= 100 || this.$i18n.t('error.recipient_less_than_100')
        ]
      },
      totalTokenRules() {
        return [
          v => parseFloat(v) > 0 || this.$i18n.t('error.number_required'),
          v => {
            const fund = this.actionFund
            const inputTokens = parseFloat(v)
            if ((fund.token.decimals >= 4 && inputTokens < Math.pow(10, -3)) || (fund.token.decimals < 4 && inputTokens < 10)) {
              return this.$i18n.t('error.too_small_number')
            }
            const totalTokens = parseFloat(v) * Math.pow(10, fund.token.decimals)
            if (totalTokens > fund.cash && (!this.userWallet.rp_enough_gas || totalTokens > fund.amount)) {
              if (fund.token.name === 'ETH') {
                const minGasEther = this.userWallet.rp_min_gas + Math.ceil(totalTokens / Math.pow(10, 9))
                return this.$i18n.t('error.rp_need_eth', {gas: minGasEther})
              }
              const minGasEther = this.userWallet.rp_min_gas
              return this.$i18n.t('error.rp_need_gas_and_token', {gas: minGasEther, tokens: parseFloat(v), symbol: fund.token.symbol})
            }
            return true
          }
        ]
      },
      tokenPriceHint() {
        const fund = this.actionFund
        if (!fund.token.price || !this.newRedpacketForm.total_tokens) {
          return ''
        }
        const totalTokens = parseFloat(this.newRedpacketForm.total_tokens)
        return this.$i18n.t('price_hint', { value: totalTokens * fund.token.price.rate, currency: fund.token.price.currency })
      },
      integerRules() {
        return [
          v => parseInt(v) > 0 || this.$i18n.t('error.number_required')
        ]
      }
    },
    methods: {
      onCopySuccess(e) {
        this.showSnackbar(this.$i18n.t('copied', { txt: e.text }))
      },
      onTokenClick(fund) {
        this.actionFund = fund
        this.actionSheet = true
      },
      onCreateRedPacket() {
        this.actionSheet = false
        if (!this.actionFund) {
          return
        }
        this.newRedpacketForm.total_tokens = 0
        this.newRedpacketForm.recipients = 0
        this.redPacketDialog = true
      },
      fundMoney(type) {
        let money = 0
        for (const fund of this.funds) {
          money += this.fundPriceTxt(fund, type)
        }
        return money
      },
      fundValueTxt(fund, type) {
        const value = type === 'cash' ? fund.cash : fund.amount
        return value / Math.pow(10, fund.token.decimals)
      },
      fundPriceTxt(fund, type) {
        if (!fund.token || !fund.token.price) {
          return 0
        }
        let value = fund.cash
        if (type === 'wallet') {
          value = fund.amount
        } else if (type === '') {
          value += fund.amount
        }
        return value / Math.pow(10, fund.token.decimals) * fund.token.price.rate
      },
      topRefresh(id) {
        this.getFunds(() => { 
          this.$refs.loadmore.onTopLoaded(id) 
        })
      },
      onTransferIn() {
        this.walletDialog = true
      },
      onTransfer() {
        this.showErrorDialog({ title: this.$i18n.t('help.developing_title'), message: this.$i18n.t('help.developing_message') })
      },
      getFunds(cb) {
        let payload = {}
        if (this.cashOnly) {
          payload.cash_only = true
        } else if (this.walletOnly) {
          payload.wallet_only = true
        }
        this.$store.dispatch(types.USER_FUND_REQUEST, payload).then(res => {
          this.toggleLoading(false)
          if (cb) {
            cb()
          }
        }, err => {
          this.toggleLoading(false)
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
      exportPrivateKey() {
        if (!this.$refs.passwordForm.validate()) {
          return false
        }
        this.exporting = true
        userAPI.exportWalletPrivateKey(this.token, { wallet_id: this.userWallet.id, passwd: this.passwordForm.passwd }).then((response) => {
          this.exporting = false
          if (response && response.code) {
            this.showErrorDialog({ title: this.$i18n.t('error.export_private_key_failed'), message: response.message })
            return
          }
          this.passwordDialog = false
          this.privateKeyResponse = response
          this.privateKeyDialog = true
        })
      },
      submitNewRedPacketForm() {
        if (!this.$refs.newRedpacketForm.validate()) {
          return false
        }
        const fund = this.actionFund
        const totalTokens = parseFloat(this.newRedpacketForm.total_tokens)
        let payload = {
          message: this.newRedpacketForm.message,
          token_address: fund.token.address,
          recipients: parseInt(this.newRedpacketForm.recipients),
          total_tokens: totalTokens,
          wallet_id: this.userWallet.id
        }
        if (this.cashOnly) {
          payload.cash_only = true
        } else if (this.walletOnly) {
          payload.wallet_only = true
        }
        this.creatingRedPacket = true
        redPacketAPI.add(this.token, payload).then((response) => {
          this.creatingRedPacket = false
          if (response.code) {
            let msg = response.message
            if (response.code === 502) {
              msg = this.$i18n.t('error.no_enough_gas', { amount: response.message })
            } else if (response.code === 503) {
              msg = this.$i18n.t('error.no_enough_token', { amount: response.message, token: fund.token.symbol })
            }
            this.showErrorDialog({ title: this.$i18n.t('error.create_red_packet_failed'), message: msg })
          } else {
            if (window.gtag) {
              window.gtag('event', 'red_packet', {'event_category': this.cashOnly ? 'cash' : (this.walletOnly ? 'wallet' : 'any'), 'event_action': 'create', 'event_label': payload.token_address, 'value': payload.total_tokens})
            }
            this.gotoRedPacket(response)
          }
        })
      },
      gotoRedPacket(packet) {
        this.$router.push({
          name: 'red-packet',
          params: {
            id: packet.id
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
      },
      showSnackbar(msg) {
        this.$store.dispatch(types.SHOW_SNACKBAR, {message: msg})
      }
    },
    mounted() {
      this.toggleLoading(true)
      this.getFunds()
      bus.$emit('changeTab', this.cashOnly ? 'cash' : (this.walletOnly ? 'wallet' : ''))
      bus.$emit('showGoback', !this.cashOnly)
      bus.$emit('update_toolbar_icons', null)
      bus.$emit('update_toolbar_items', null)
    }
  }

</script>