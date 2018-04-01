<template>
  <v-container class="fluid px-0 pt-0">
    <loadmore 
      :top-method="topRefresh" 
      :topPullText="$t('loadmore.topPullText')"
      :topDropText="$t('loadmore.releaseText')"
      :topLoadingText="$t('loadmore.loadingText')"
      ref="loadmore">
      <v-container fluid v-if="promotion && promotion.id==promotionId">
        <header class="title mb-2">{{ promotion.airdrop.title }}</header>
        <template v-if="promotion.airdrop.token">
          <v-btn block small :href="'https://etherscan.io/token/' + promotion.airdrop.token.address">{{ promotion.airdrop.token.address }}</v-btn>
          <div class="text-xs-center">
            <v-chip small label outline color="primary">
              {{ $t('token_name') }}: <strong>{{ promotion.airdrop.token.name }}</strong>
            </v-chip>
            <v-chip small label outline color="primary">
              {{ $t('token_symbol') }}: <strong>{{ promotion.airdrop.token.symbol }}</strong>
            </v-chip>
            <v-chip small label outline color="primary">
              {{ $t('token_decimals') }}: <strong>{{ promotion.airdrop.token.decimals }}</strong></strong>
            </v-chip>
          </div>
        </template>
        <v-layout row justify-space-between>
          <v-flex xs7>
            <v-btn depressed >
              <v-icon>mdi-airballoon</v-icon>{{ $t('give_out_label') }} : {{ promotion.airdrop.give_out }} {{ $t('symbol_per_user', {symbol: promotion.airdrop.token.symbol}) }}
            </v-btn>
          </v-flex>
          <v-flex xs5>
            <v-btn depressed>
              <v-icon>mdi-trophy-award</v-icon>{{ $t('bonus', {bonus: promotion.airdrop.bonus}) }}
            </v-btn>
          </v-flex>
        </v-layout>
        <v-btn block color="success" 
          :disabled="!promotion || !promotion.airdrop.status" 
          v-clipboard:copy="promotion.link"
          v-clipboard:success="onCopySuccess">{{ $t('promote_btn') }}</v-btn>
      </v-container>
      <v-divider></v-divider>
      <promotion-stats ref="statsView" class="mb-2" :promotion-id="promotion.id" v-if="promotion && promotion.id == promotionId"></promotion-stats>
    </loadmore>
  </v-container>
</template>

<script>
  import Loadmore from '../components/Loadmore.vue'
  import PromotionStats from '../components/PromotionStats'
  import * as types from '../store/mutation-types'
  import i18n from '../locale/promotion'
  import moment from 'moment'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    components: {
      'loadmore': Loadmore,
      'promotion-stats': PromotionStats
    },
    data() {
      return {
        promotionId: 0
      }
    },
    computed: {
      promotion() {
        return this.$store.getters.getPromotionById(this.promotionId)
      },
      user() {
        return this.$store.getters['userInfo']
      },
      token() {
        return this.$store.getters['token']
      }
    },
    methods: {
      dateFormat(d) {
        return moment(d).format('YYYY-MM-DD')
      },
      onCopySuccess(e) {
        this.showSnackbar(this.$i18n.t('copied', { txt: e.text }))
      },
      topRefresh(id) {
        this.getPromotion(() => { 
          this.$refs.loadmore.onTopLoaded(id) 
          this.$refs.statsView.getStats()
        })
      },
      getPromotion(cb) {
        this.$store.dispatch(types.PROMOTION_GET_REQUEST, { token: this.token, id: this.promotionId }).then(res => {
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
      getChannels() {
        this.$store.dispatch(types.CHANNEL_LIST_REQUEST, this.token).then(res => {}, err => {
          if (err.code === 401) {
            this.$router.push({
              name: 'login'
            })
            return
          }
          this.showErrorDialog({ title: this.$i18n.t('error.get_channels_failed'), message: err.message })
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
      this.promotionId = parseInt(this.$route.params.id)
    },
    mounted() {
      if (!this.promotion || this.promotion.id !== this.promotionId) {
        this.toggleLoading(true)
        this.getPromotion()
      }
      bus.$emit('update_toolbar_items', null)
      bus.$emit('update_toolbar_icons', null)
    }
  }

</script>