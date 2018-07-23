<template>
  <v-container fluid fill-height class="px-0 pt-0" style="overflow-y:scroll">
    <v-dialog v-model="applyAirdropDialog">
      <v-card>
        <v-card-title class="headline">{{ $t('apply_airdrop_title') }}</v-card-title>
        <v-card-text>{{ $t('apply_airdrop_message') }}</v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click.native="applyAirdropDialog=false">{{ $t('close') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="applingPublisher" @click.native="applyAirdrop">{{ $t('apply_btn') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      <template v-for="(airdrop, index) in airdrops">
        <v-divider v-if="index>0" :key="'divider'+index"></v-divider>
        <v-card flat :to="{name:'airdrop', params: {id: airdrop.id}}" class="mb-2" :key="airdrop.id">
          <v-card-title primary-title>
            <v-container fluid class="px-0 pt-0 pb-0">
              <v-layout row wrap align-content-start justify-space-between>
                <v-flex xs9>
                  <h3 class="headline mb-0">{{ airdrop.title }}</h3>
                </v-flex>
                <v-flex xs3 class="text-xs-right">
                  <span class="red--text" v-if="airdrop.status==0">{{ $t('airdrop.status.stop') }}</span>
                  <span class="green--text" v-else>{{ $t('airdrop.status.start') }}</span>
                </v-flex>
              </v-layout>
              <div>
                <v-chip label color="pink" text-color="white"><v-icon small>mdi-airballoon</v-icon>{{ airdrop.give_out }} {{ airdrop.token.symbol }}</v-chip>
                <v-chip label><v-icon small>mdi-trophy-award</v-icon>{{ airdrop.bonus }}%</v-chip>
                <span class="grey--text">@{{ airdrop.telegram_group }}</span>
              </div>
              <div class="grey--text mt-2" v-if="airdrop.token.protocol=='ERC20'">
                {{ $t('gas_balance_label') }}: {{ airdrop.gas_balance_gwei }}<sup>GAS(Gwei)</sup>, {{ airdrop.token_balance / Math.pow(10, airdrop.token.decimals) }}<sup>{{ airdrop.token.symbol }}</sup>
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
  import airdropAPI from '../api/airdrop'
  import moment from 'moment'
  import i18n from '../locale/airdrops'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    components: {
      'loadmore': Loadmore
    },
    data() {
      return {
        applyAirdropDialog: false,
        applingPublisher: false,
        queryParams: {
          page: 1,
          page_size: 10,
          mine: '',
          status: 10,
          balance_status: 10
        }
      }
    },
    computed: {
      airdrops() {
        return this.$store.getters['airdrops']
      },
      isPublisher() {
        return this.$store.getters['isPublisher']
      },
      user() {
        return this.$store.getters['userInfo']
      },
      token() {
        return this.$store.getters['token']
      },
      allLoaded() {
        return (this.airdrops.length % this.queryParams.page_size) !== 0
      }
    },
    methods: {
      dateFormat(d) {
        return moment(d).format('YYYY-MM-DD')
      },
      topRefresh(id) {
        this.queryParams.page = 1
        this.getAirdrops(() => { this.$refs.loadmore.onTopLoaded(id) })
      },
      bottomRefresh(id) {
        console.log('bottomRefreshed')
        this.queryParams.page += 1
        this.getAirdrops(() => { this.$refs.loadmore.onBottomLoaded(id) })
        //this.allLoaded = true;
      },
      getAirdrops(cb) {
        this.$store.dispatch(types.AIRDROP_LIST_REQUEST, { token: this.token, params: this.queryParams }).then(res => {
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
      applyAirdrop() {
        this.applingPublisher = true
        airdropAPI.applyPublisher(this.token).then((response) => {
          this.applingPublisher = false
          if (response.code) {
            this.showErrorDialog({ title: this.$i18n.t('error.apply_publisher_failed'), message: response.message })
            return
          }
          this.applyAirdropDialog = false
          this.showErrorDialog({ title: this.$i18n.t('apply_publisher_success_title'), message: this.$i18n.t('apply_publisher_success_message') })
        })
      },
      toggleLoading(v) {
        let state = types.HIDE_LOADING
        if (v) {
          state = types.SHOW_LOADING
        }
        this.$store.dispatch(state)
      },
      resetQueryParams() {
        this.queryParams = {
          page: 1,
          page_size: 10,
          mine: '',
          status: 10,
          balance_status: 10
        }
      },
      showErrorDialog(err) {
        this.$store.dispatch(types.SHOW_ERROR_DIALOG, err)
      }
    },
    created() {
      bus.$on('filter_airdrops', () => {
      })
      bus.$on('apply_publisher', () => {
        this.applyAirdropDialog = true
      })
    },
    mounted() {
      this.toggleLoading(true)
      this.getAirdrops()
      let items = null
      if (this.isPublisher) {
        items = [
          //{ name: 'filterAirdrops', icon: 'mdi-filter-variant', event: { name: 'filter_airdrops' } }, 
          { name: 'addAirdrop', icon: 'mdi-plus', goto: { name: 'add_airdrop' } }
        ]
      } else {
        items = [
          { name: 'addAirdrop', icon: 'mdi-plus', event: { name: 'apply_publisher' } }
        ]
      }
      bus.$emit('update_toolbar_icons', items)
      bus.$emit('update_toolbar_items', null)
    },
    beforeDestroy() {
      this.resetQueryParams()
      bus.$off('filter_airdrops')
      bus.$off('apply_publisher')
    }
  }

</script>