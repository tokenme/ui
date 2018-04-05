<template>
  <v-container fluid fill-height class="px-0 pt-0 d-block text-xs-center" style="background-color:#bd503a">
    <v-toolbar>
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
    <div class="topcontent">
      <v-container fluid class="text-xs-center">
        <v-form v-model="newRedpacketForm.valid" ref="newRedpacketForm" lazy-validation>
          <v-select
            :label="$t('choose_token')"
            :items="funds"
            :filter="customFilter"
            v-model="actionFund"
            item-text="token.name"
            item-value="token.address"
            return-object
            max-height="auto"
            autocomplete
            v-if="funds"
          >
            <template slot="selection" slot-scope="data">
              <v-chip
                @input="data.parent.selectItem(data.item)"
                :selected="data.selected"
                :key="JSON.stringify(data.item)"
                v-if="data.item"
              >
                <v-avatar>
                  <img :src="data.item.token.logo_address" v-if="data.item.token.logo_address">
                </v-avatar>
                {{ data.item.token.name }} ({{ fundValueTxt(data.item, activeType) }} {{ data.item.token.symbol }})
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <template v-if="data.item.token">
                <v-list-tile-avatar>
                  <img :src="data.item.avatar" v-if="data.item.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ fundValueTxt(data.item, activeType) }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ data.item.name }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text class="text-xs-right">
                    <v-chip label small class="mr-0">{{ data.item.token.symbol }}</v-chip>
                    <template v-if="data.item.token.price">
                      <br/>
                      ≈ {{ fundPriceTxt(data.item, activeType).toFixed(4) }}{{ data.item.token.price.currency }}
                    </template>
                  </v-list-tile-action-text>
                </v-list-tile-action>
              </template>
            </template>
          </v-select>
          <v-text-field 
            v-model="newRedpacketForm.total_tokens" 
            :label="$t('total_tokens_label')" 
            :prepend-icon="actionFund && actionFund.token.name==='ETH'?'mdi-currency-eth':'mdi-coins'"
            :suffix="totalTokensSuffix" 
            :rules="totalTokenRules" 
            :hint="tokenPriceHint"
            required></v-text-field>
          <v-text-field v-model="newRedpacketForm.recipients" :label="$t('recipients_label')" prepend-icon="mdi-airballoon" :rules="recipientRules" required></v-text-field>
          <v-text-field v-model="newRedpacketForm.message" :label="$t('message_label')" :rules="messageRules"></v-text-field>
        </v-form>
        <v-btn large round color="primary" :disabled="!newRedpacketForm.valid || creatingRedPacket" :loading="creatingRedPacket" @click="submitNewRedPacketForm">{{ $t('create_redpacket') }}</v-btn>
      </v-container>
    </div>
    <v-btn small color="secondary" 
      v-clipboard:copy="userWallet.wallet"
      v-clipboard:success="onCopySuccess" v-if="activeType === 'wallet'">
      {{ $t('copy_wallet_address') }}
    </v-btn>
  </v-container>
</template>

<style scoped>
.topcontent{
  background-color: white;
  border-radius: 0 0 50% 50%/0 0 15% 15%;
}
</style>
<script>
  import * as types from '../store/mutation-types'
  import redPacketAPI from '../api/red-packet'
  import i18n from '../locale/add-red-packet.js'
  import { bus } from '../bus'
  
  export default {
    i18n: i18n,
    data() {
      return {
        creatingRedPacket: false,
        newRedpacketForm: {
          valid: true,
          message: '',
          total_tokens: 0,
          recipients: 0
        },
        actionFund: null,
        activeType: 'cash',
        customFilter (item, queryText, itemText) {
          const hasValue = val => val != null ? val : ''
          if (!hasValue(item) || !hasValue(item.token)) {
            return false
          }
          const name = hasValue(item.token.name)
          const symbol = hasValue(item.token.symbol)
          const query = hasValue(queryText)
          return name.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1 || symbol.toString().toLowerCase().indexOf(query.toString().toLowerCase()) > -1
        }
      }
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
        if (!this.userWallet) {
          return []
        }
        let funds = []
        for (let i of this.userWallet.funds) {
          funds.push({token: i.token, amount: i.amount, cash: i.cash, name: i.token.name, avatar: i.token.logo_address})
          funds.push({ divider: true })
        }
        return funds
      },
      token() {
        return this.$store.getters['token']
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
            if (!fund) {
              return this.$i18n.t('error.token_required')
            }
            const inputTokens = parseFloat(v)
            if ((fund.token.decimals >= 4 && inputTokens < Math.pow(10, -3)) || (fund.token.decimals < 4 && inputTokens < 10)) {
              return this.$i18n.t('error.too_small_number')
            }
            const totalTokens = parseFloat(v) * Math.pow(10, fund.token.decimals)
            if ((this.activeType === 'cash' && totalTokens > fund.cash) || (this.activeType !== 'cash' && totalTokens > fund.amount)) {
              return this.$i18n.t('error.no_enough_token', { amount: totalTokens, token: fund.token.symbol })
            }
            return true
          }
        ]
      },
      tokenPriceHint() {
        const fund = this.actionFund
        if (!fund || !fund.token.price || !this.newRedpacketForm.total_tokens) {
          return ''
        }
        const totalTokens = parseFloat(this.newRedpacketForm.total_tokens)
        return this.$i18n.t('price_hint', { value: totalTokens * fund.token.price.rate, currency: fund.token.price.currency })
      },
      integerRules() {
        return [
          v => parseInt(v) > 0 || this.$i18n.t('error.number_required')
        ]
      },
      totalTokensSuffix() {
        const symbol = (this.actionFund && this.actionFund.token.name === 'ETH') ? 'Ether' : ''
        if (!this.actionFund) {
          return symbol
        }
        const tokens = this.fundValueTxt(this.actionFund, this.activeType) - this.newRedpacketForm.total_tokens
        return this.$i18n.t('token_left_suffex', { value: tokens, symbol: symbol })
      }
    },
    methods: {
      onCopySuccess(e) {
        this.showSnackbar(this.$i18n.t('copied', { txt: e.text }))
      },
      toggleType(t) {
        this.activeType = t
      },
      onCreateRedPacket() {
        this.actionSheet = false
        if (!this.actionFund) {
          return
        }
        this.newRedpacketForm.total_tokens = 0
        this.newRedpacketForm.recipients = 0
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
      getFunds(type) {
        let payload = {}
        this.$store.dispatch(types.USER_FUND_REQUEST, payload).then(res => {
          this.toggleLoading(false)
        }, err => {
          this.toggleLoading(false)
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.showErrorDialog({ title: this.$i18n.t('error.get_funds_failed'), message: err.message })
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
              window.gtag('event', 'red_packet', {'event_category': this.activeType, 'event_action': 'create', 'event_label': payload.token_address, 'value': payload.total_tokens})
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
      bus.$emit('showGoback', false)
      bus.$emit('changeTab', 'addRedPacket')
    }
  }
</script>