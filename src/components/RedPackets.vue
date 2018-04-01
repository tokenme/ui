<template>
  <v-container fluid fill-height class="px-0 pt-0">
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
      <template v-for="(rp, index) in redPackets">
        <v-divider v-if="index>0" :key="'divider'+index"></v-divider>
        <v-card flat :to="{name:'red-packet', params: {id: rp.id}}" :color="rp.status===6?'grey lighten-5':''" class="mb-2" :key="rp.id">
          <v-card-title class="pb-0">
            <v-container fluid class="px-0 pt-0 pb-0">
              <span class="grey--text">{{ $t('create_time', {date: rp.inserted}) }}</span><br>
              <v-layout row wrap align-content-start justify-space-between>
                <v-flex xs2 class="text-xs-right pr-3" v-if="rp.token.logo_address">
                  <img :src="rp.token.logo_address" width="32" height="32"/>
                </v-flex>
                <v-flex xs6>
                  <h4>{{ rp.token.name }}</h4>
                  <small class="grey--text">{{ rp.token.symbol }}</small>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs2 class="text-xs-right" v-if="rp.status==6">
                  <v-chip small color="red" text-color="white">{{ $t('expired') }}</v-chip>
                </v-flex>
              </v-layout>
              <div class="mt-3">
                {{ $t('total_tokens_label', {num: rp.recipients, value: rp.total_tokens/Math.pow(10, rp.token.decimals), 'symbol': rp.token.symbol}) }}
              </div>
              <v-progress-linear :indeterminate="true" v-if="rp.fund_tx_status==1"></v-progress-linear>
              <div class="grey--text mt-2">{{ rp.message }}</div>
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
  import i18n from '../locale/red-packets'
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
      redPackets() {
        return this.$store.getters['redPackets']
      },
      user() {
        return this.$store.getters['userInfo']
      },
      token() {
        return this.$store.getters['token']
      },
      allLoaded() {
        return (this.redPackets.length % this.queryParams.page_size) !== 0
      }
    },
    methods: {
      topRefresh(id) {
        this.queryParams.page = 1
        this.getRedPackets(() => { this.$refs.loadmore.onTopLoaded(id) })
      },
      bottomRefresh(id) {
        this.queryParams.page += 1
        this.getRedPackets(() => { this.$refs.loadmore.onBottomLoaded(id) })
      },
      getRedPackets(cb) {
        this.$store.dispatch(types.REDPACKET_LIST_REQUEST, { token: this.token, params: this.queryParams }).then(res => {
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
      this.getRedPackets()
      bus.$emit('changeTab', '')
      bus.$emit('showGoback', true)
      bus.$emit('update_toolbar_icons', null)
      bus.$emit('update_toolbar_items', null)
    }
  }

</script>