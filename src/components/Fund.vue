<template>
  <v-container fluid fill-height class="px-0 pt-0 d-block">
    <v-bottom-sheet v-model="actionSheet">
      <v-list>
        <v-list-tile :to="{path:'/token/'+(actionFund.token.name==='ETH'?'ETH':actionFund.token.address)}" v-if="actionFund && actionFund.token.price">
          <v-list-tile-avatar>
            <v-icon>mdi-information</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('token_details') }}</v-list-tile-title>
        </v-list-tile>
        <v-divider v-if="actionFund && actionFund.token.price && activeType"></v-divider>
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
          <v-list-tile-title v-if="activeType==='cash' && actionFund && actionFund.deposit_tx" style="height:30px;font-size:10px">
            <small>{{ $t('transfering') }}:{{ actionFund.deposit_tx }}</small>
            <v-progress-linear :indeterminate="true" height="5" class="mt-0 mb-0"></v-progress-linear>
          </v-list-tile-title>
          <v-list-tile-title v-else>{{ activeType==='cash' ? $t('transfer_from_wallet') : $t('transfer_in') }}</v-list-tile-title>
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
            v-clipboard:success="onCopySuccess" style="text-transform:none;font-size:10px">{{ userWallet.wallet }}</v-btn>
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
    <v-dialog v-model="depositDialog">
      <v-card v-if="actionFund">
        <v-card-title>
          {{ $t('transfer_from_wallet') }} ({{ actionFund.token.name }})
        </v-card-title>
        <v-card-text>
          <v-form v-model="depositForm.valid" ref="depositForm" lazy-validation>
            <v-text-field 
              v-model="depositForm.total_tokens" 
              :label="$t('total_tokens_label')" 
              :prepend-icon="actionFund.token.name==='ETH'?'mdi-currency-eth':'mdi-coins'"
              :suffix="actionFund.token.name==='ETH'?'Ether':''" 
              :rules="depositRules" 
              :hint="tokenPriceHint"
              required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="depositDialog=false">{{ $t('close') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :disabled="!depositForm.valid || depositing" :loading="depositing" @click="submitDepositForm">{{ $t('submit') }}</v-btn>
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
    <v-toolbar v-if="activeType">
      <v-toolbar-items>
        <v-btn flat :class="cashClass" @click="toggleType('cash')">
          <v-icon>mdi-currency-usd</v-icon>{{ $t('from_cash') }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat :class="walletClass" @click="toggleType('wallet')">
          <v-icon>mdi-wallet</v-icon>{{ $t('from_wallet') }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <loadmore 
      :top-method="topRefresh" 
      :topPullText="$t('loadmore.topPullText')"
      :topDropText="$t('loadmore.releaseText')"
      :topLoadingText="$t('loadmore.loadingText')"
      ref="loadmore">
      <v-container v-if="!activeType">
        <v-card v-if="userWallet" color="primary" class="white--text">
          <v-card-title primary-title>
            <div class="headline">
              {{ userWallet.name }}
              <v-chip v-if="userWallet.is_main==1" small label color="red" text-color="white">
                {{ $t('main')}}
              </v-chip>
            </div>
          </v-card-title>
          <v-card-actions>
            <span style="font-size:50%">≈</span> {{ fundMoney('').toFixed(4) }}<sub style="font-size:50%">USD</sub>
            <v-spacer></v-spacer>
            <v-btn flat icon color="white" @click.native="walletDialog=true"><v-icon>mdi-qrcode</v-icon></v-btn>
            <v-btn color="warning" @click.native="passwordDialog=true" v-if="userWallet.is_private==1">{{ $t('export_private_key') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
      <v-container v-if="activeType">
        <v-card v-if="userWallet" color="primary" class="white--text">
          <v-card-title primary-title class="d-block">
            <div class="headline text-xs-center">
              <span style="font-size:50%">≈</span> {{ fundMoney(activeType).toFixed(4) }}<sub style="font-size:50%">USD</sub>
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
              <v-list-tile-title>{{ fundValueTxt(fund, activeType) }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ activeType ? fund.token.name : ($t('cash') + ': ' + fundValueTxt(fund, 'cash')) }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text class="text-xs-right">
                {{ activeType ? '' : fund.token.name }}<v-chip label small class="mr-0">{{ fund.token.symbol }}</v-chip>
                <template v-if="fund.token.price">
                  <br/>
                  ≈ {{ fundPriceTxt(fund, activeType).toFixed(4) }}{{ fund.token.price.currency }}
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
        depositing: false,
        walletDialog: false,
        depositDialog: false,
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
        depositForm: {
          valid: true,
          total_tokens: 0
        },
        passwordForm: {
          valid: true,
          passwd: ''
        },
        actionSheet: false,
        actionFund: null,
        activeType: ''
      }
    },
    props: {
      cashOnly: false,
      walletOnly: false
    },
    computed: {
      cashClass() {
        return this.activeType === 'cash' ? 'btn--active' : ''
      },
      walletClass() {
        return this.activeType === 'wallet' ? 'btn--active' : ''
      },
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
            if ((this.activeType === 'cash' && totalTokens > fund.cash) || (this.activeType !== 'cash' && totalTokens > fund.amount)) {
              return this.$i18n.t('error.no_enough_token', { amount: v, token: fund.token.symbol })
            }
            return true
          }
        ]
      },
      depositRules() {
        return [
          v => parseFloat(v) > 0 || this.$i18n.t('error.number_required'),
          v => {
            const fund = this.actionFund
            const inputTokens = parseFloat(v)
            if ((fund.token.decimals >= 4 && inputTokens < Math.pow(10, -3)) || (fund.token.decimals < 4 && inputTokens < 10)) {
              return this.$i18n.t('error.too_small_number')
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
      toggleType(t) {
        this.activeType = t
      },
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
        this.actionSheet = false
        if (this.activeType !== 'cash') {
          this.walletDialog = true
          return
        }
        if (!this.actionFund) {
          return
        }
        if (this.actionFund.deposit_tx) {
          this.$copyText(this.actionFund.deposit_tx).then(res => {
            this.onCopySuccess(res)
          }, err => {
            console.log(err)
          })
          return
        }
        this.depositForm.total_tokens = 0
        this.depositDialog = true
      },
      onTransfer() {
        this.actionSheet = false
        this.showErrorDialog({ title: this.$i18n.t('help.developing_title'), message: this.$i18n.t('help.developing_message') })
      },
      getFunds(cb) {
        let payload = {}
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
          wallet_id: this.userWallet.id,
          from: this.activeType
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
              window.gtag('event', 'red_packet', {'event_category': this.activeType || 'any', 'event_action': 'create', 'event_label': payload.token_address, 'value': payload.total_tokens})
            }
            this.gotoRedPacket(response)
          }
        })
      },
      submitDepositForm() {
        if (!this.$refs.depositForm.validate()) {
          return false
        }
        const fund = this.actionFund
        const totalTokens = parseFloat(this.depositForm.total_tokens)
        let payload = {
          token_address: fund.token.address,
          total_tokens: totalTokens
        }
        this.depositing = true
        redPacketAPI.deposit(this.token, payload).then((response) => {
          this.depositing = false
          if (response.code) {
            let msg = response.message
            if (response.code === 502) {
              msg = this.$i18n.t('error.no_enough_gas', { amount: response.message })
            } else if (response.code === 503) {
              msg = this.$i18n.t('error.no_enough_token', { amount: response.message, token: fund.token.symbol })
            }
            this.showErrorDialog({ title: this.$i18n.t('error.deposit_failed'), message: msg })
          } else {
            if (window.gtag) {
              window.gtag('event', 'red_packet', {'event_category': 'deposit', 'event_action': 'deposit', 'event_label': payload.token_address, 'value': payload.total_tokens})
            }
            this.showErrorDialog({ title: this.$i18n.t('success'), message: this.$i18n.t('deposit_wait_tx_done') })
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
      this.activeType = this.cashOnly ? 'cash' : (this.walletOnly ? 'wallet' : '')
      this.toggleLoading(true)
      this.getFunds()
      bus.$emit('changeTab', 'cash')
      bus.$emit('showGoback', !this.activeType)
      bus.$emit('update_toolbar_icons', null)
      bus.$emit('update_toolbar_items', null)
    }
  }

</script>