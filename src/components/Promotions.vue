<template>
  <v-container fluid fill-height class="px-0 pt-0" style="overflow-y:scroll">
    <loadmore 
      :top-method="topRefresh" 
      :bottom-method="bottomRefresh" 
      :bottom-all-loaded="allLoaded" 
      :topPullText="$t('loadmore.topPullText')"
      :topDropText="$t('loadmore.releaseText')"
      :topLoadingText="$t('loadmore.loadingText')"
      :bottomPullText="$t('loadmore.buttomPullText')"
      :bottomDropText="$t('loadmore.releaseText')"
      :bottomLoadingText="$t('loadmore.loadingText')"
      ref="loadmore">
      <template v-for="(promotion, index) in promotions">
        <v-divider v-if="index>0" :key="'divider'+index"></v-divider>
        <v-card flat :to="{name:'promotion', params: {id: promotion.id}}" class="mb-2" :key="promotion.id">
          <v-card-title primary-title>
            <v-container fluid class="px-0 pt-0 pb-0">
              <h3 class="headline mb-0">{{ promotion.airdrop.title }}</h3>
              <div>
                <v-chip label color="pink" text-color="white"><v-icon small>mdi-airballoon</v-icon>{{ promotion.airdrop.give_out }} {{ promotion.airdrop.token.symbol }}</v-chip>
                <v-chip label><v-icon small>mdi-trophy-award</v-icon>{{ promotion.airdrop.bonus }}%</v-chip>
                <span class="grey--text">@{{ promotion.airdrop.telegram_group }}</span>
              </div>
              <div class="grey--text mt-2" v-if="promotion.airdrop.token.protocol==='ERC20'">
                {{ $t('gas_balance_label') }}: {{ promotion.airdrop.gas_balance_gwei }}<sup>GAS(Gwei)</sup>, {{ promotion.airdrop.token_balance / Math.pow(10, promotion.airdrop.token.decimals)}}<sup>{{ promotion.airdrop.token.symbol }}</sup>
              </div>
              <div class="mt-2">
                {{ $t('channel') }}: {{ promotion.channel_name }} <v-icon small>mdi-arrow-right-bold</v-icon> {{ $t('adzone') }}: {{ promotion.adzone_name }}
              </div>
            </v-container>
          </v-card-title>
        </v-card>
      </template>
    </loadmore>
  </v-container>
</template>

<script>
  import Loadmore from '../components/Loadmore.vue'
  import * as types from '../store/mutation-types'
  import moment from 'moment'
  import i18n from '../locale/promotions'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    components: {
      'loadmore': Loadmore
    },
    data() {
      return {
        loading: false,
        queryParams: {
          page: 1,
          page_size: 10
        }
      }
    },
    computed: {
      promotions() {
        return this.$store.getters['promotions']
      },
      user() {
        return this.$store.getters['userInfo']
      },
      token() {
        return this.$store.getters['token']
      },
      allLoaded() {
        return (this.promotions.length % this.queryParams.page_size) !== 0
      }
    },
    methods: {
      dateFormat(d) {
        return moment(d).format('YYYY-MM-DD')
      },
      topRefresh(id) {
        this.queryParams.page = 1
        this.getPromotions(() => { this.$refs.loadmore.onTopLoaded(id) })
      },
      bottomRefresh(id) {
        this.queryParams.page += 1
        this.getPromotions(() => { this.$refs.loadmore.onBottomLoaded(id) })
        //this.allLoaded = true;
      },
      getPromotions(cb) {
        this.$store.dispatch(types.PROMOTION_LIST_REQUEST, { token: this.token, params: this.queryParams }).then(res => {
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
      resetQueryParams() {
        this.queryParams = {
          page: 1,
          page_size: 10
        }
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
      this.toggleLoading(true)
      this.getPromotions()
      bus.$emit('update_toolbar_icons', null)
      bus.$emit('update_toolbar_items', null)
    },
    beforeDestroy() {
      this.resetQueryParams()
    }
  }

</script>