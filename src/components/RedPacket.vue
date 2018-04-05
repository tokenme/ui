<template>
  <v-container class="fluid px-0 pt-0">
    <v-dialog v-model="shareWechatDialog" v-if="redPacket" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('wechat_share_title') }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field multi-line class="input-group--focused" v-model="shareMessage"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="secondary" @click="shareWechatDialog=false">{{ $t('close') }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="primary" 
            v-clipboard:copy="shareMessage"
            v-clipboard:success="onCopySuccess">{{ $t('copy') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="shareSheet">
      <v-list>
        <v-subheader>{{ $t('share.title') }}</v-subheader>
        <v-list-tile @click="copyLink">
          <v-list-tile-avatar>
            <v-avatar tile>
              <v-icon>mdi-content-copy</v-icon>
            </v-avatar>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('share.copy') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile :href="share.link">
          <v-list-tile-avatar>
            <v-avatar tile>
              <v-icon>mdi-apple-safari</v-icon>
            </v-avatar>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('share.open') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="shareWechat">
          <v-list-tile-avatar>
            <v-avatar tile>
              <v-icon>mdi-wechat</v-icon>
            </v-avatar>
          </v-list-tile-avatar>
          <v-list-tile-title>{{ $t('share.wechat') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
      <social-sharing 
      :url="share.link" 
      :title="share.title"
      :description="share.description"
      :hashtags="share.hashtags"
      network-tag = "div"
      inline-template>
        <v-list>
          <v-list-tile>
            <network network="telegram" class="list__tile px-0">
              <v-list-tile-avatar>
                <v-avatar tile>
                  <v-icon>mdi-telegram</v-icon>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $t('share.telegram') }}</v-list-tile-title>
            </network>
          </v-list-tile>
          <v-list-tile>
            <network network="facebook" class="list__tile px-0">
              <v-list-tile-avatar>
                <v-avatar tile>
                  <v-icon>mdi-facebook</v-icon>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $t('share.facebook') }}</v-list-tile-title>
            </network>
          </v-list-tile>
          <v-list-tile>
            <network network="googleplus" class="list__tile px-0">
              <v-list-tile-avatar>
                <v-avatar tile>
                  <v-icon>mdi-google-plus</v-icon>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $t('share.googleplus') }}</v-list-tile-title>
            </network>
          </v-list-tile>
          <v-list-tile>
            <network network="twitter" class="list__tile px-0">
              <v-list-tile-avatar>
                <v-avatar tile>
                  <v-icon>mdi-twitter</v-icon>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $t('share.twitter') }}</v-list-tile-title>
            </network>
          </v-list-tile>
          <v-list-tile>
            <network network="weibo" class="list__tile px-0">
              <v-list-tile-avatar>
                <v-avatar tile>
                  <v-icon>mdi-weibo</v-icon>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $t('share.weibo') }}</v-list-tile-title>
            </network>
          </v-list-tile>
          <v-list-tile>
            <network network="line" class="list__tile px-0">
              <v-list-tile-avatar>
                <v-avatar tile>
                  <v-icon>mdi-message-outline</v-icon>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $t('share.line') }}</v-list-tile-title>
            </network>
          </v-list-tile>
          <v-list-tile>
            <network network="whatsapp" class="list__tile px-0">
              <v-list-tile-avatar>
                <v-avatar tile>
                  <v-icon>mdi-whatsapp</v-icon>
                </v-avatar>
              </v-list-tile-avatar>
              <v-list-tile-title>{{ $t('share.whatsapp') }}</v-list-tile-title>
            </network>
          </v-list-tile>
        </v-list>
      </social-sharing>
    </v-bottom-sheet>
    <loadmore 
      :top-method="topRefresh" 
      :topPullText="$t('loadmore.topPullText')"
      :topDropText="$t('loadmore.releaseText')"
      :topLoadingText="$t('loadmore.loadingText')"
      ref="loadmore">
      <v-container fluid v-if="redPacket && redPacket.id==redPacketId">
        <span class="grey--text">{{ $t('create_time', {date: redPacket.inserted}) }}</span><br/>
        <v-layout row wrap align-content-start justify-space-between>
          <v-flex xs2 class="text-xs-right pr-3" v-if="redPacket.token.logo_address">
            <img :src="redPacket.token.logo_address" width="32" height="32"/>
          </v-flex>
          <v-flex xs8 @click="gotoToken">
            <h3>{{ redPacket.token.name }}</h3>
            <small class="grey--text">{{ redPacket.token.symbol }}</small>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex xs2 class="text-xs-right" v-if="redPacket.status==6">
            <v-chip small color="red" text-color="white">{{ $t('expired') }}</v-chip>
          </v-flex>
        </v-layout>
        <h3 class="headline mb-3 text-xs-center">{{ $t('headline', {num: redPacket.recipients}) }}</h3>
        <span>{{ redPacket.message }}</span>
        <v-btn block color="primary" v-if="redPacket.fund_tx_status!=1" @click.native="showShareSheet">{{ $t('share.title') }}</v-btn>
        <template v-else>
          <v-btn block color="primary" @click.native="shareLinkAlert">{{ $t('share.title') }}</v-btn>
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </template>
      </v-container>
      <v-divider></v-divider>
      <v-list two-line v-if="redPacket">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <v-icon>mdi-coins</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ redPacket.total_tokens/Math.pow(10, redPacket.token.decimals) }} {{ redPacket.token.symbol }}
            </v-list-tile-title>
            <v-list-tile-sub-title>{{ $t('total_tokens_label') }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list subheader two-line v-if="redPacket && redPacket.submitted_recipients">
        <v-subheader>{{ $t('recipients') }}</v-subheader>
        <template v-for="(recipient, index) in redPacket.submitted_recipients">
          <v-divider v-if="index>0" inset :key="'divider'+index"></v-divider>
          <v-list-tile avatar :key="recipient.id">
            <v-list-tile-avatar>
              <img :src="recipient.user.avatar">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ recipient.user.showname }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ recipient.submitted_time }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>
                {{ giveOutDisplayText(recipient) }}
                <template v-if="redPacket && redPacket.token.price">
                  <br/>
                  ≈ {{ recepientPriceTxt(recipient, redPacket.token).toFixed(4) }}{{ redPacket.token.price.currency }}
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
  import * as types from '../store/mutation-types'
  import i18n from '../locale/red-packet'
  import { bus } from '../bus'

  export default {
    i18n: i18n,
    components: {
      'loadmore': Loadmore
    },
    data() {
      return {
        redPacketId: 0,
        shareSheet: false,
        shareWechatDialog: false,
        shareMessage: ''
      }
    },
    computed: {
      redPacket() {
        return this.$store.getters.getRedPacketById(this.redPacketId)
      },
      user() {
        return this.$store.getters['userInfo']
      },
      token() {
        return this.$store.getters['token']
      },
      share() {
        let title = this.$i18n.t('rp_share.default')
        let link = ''
        if (this.redPacket) {
          title = this.$i18n.t('rp_share.title', {user: this.user.showname, num: this.redPacket.recipients, token: this.redPacket.token.name})
          link = this.redPacket.short_url || this.redPacket.link
        }
        return {
          link: link,
          title: title,
          description: this.$i18n.t('rp_share.desc'),
          hashtags: 'eth,ethereum,red packet,token,cryptocurrency'
        }
      }
    },
    methods: {
      copyLink() {
        this.shareSheet = false
        this.$copyText(this.share.link).then(res => {
          this.onCopySuccess(res)
        }, err => {
          console.log(err)
        })
      },
      onCopySuccess(e) {
        this.showSnackbar(this.$i18n.t('copied', { txt: e.text }))
        this.shareWechatDialog = false
      },
      giveOutDisplayText(recipient) {
        return recipient.give_out / Math.pow(10, recipient.decimals)
      },
      recepientPriceTxt(recipient, token) {
        if (!token.price) {
          return 0
        }
        const value = recipient.give_out
        return value / Math.pow(10, token.decimals) * token.price.rate
      },
      showShareSheet() {
        if (this.redPacket.status === 6) {
          this.showErrorDialog({title: this.$i18n.t('share_link_alert_title'), message: this.$i18n.t('share_link_expire_alert')})
          return
        }
        this.shareSheet = true
      },
      shareLinkAlert() {
        this.showErrorDialog({title: this.$i18n.t('share_link_alert_title'), message: this.$i18n.t('share_link_alert_msg')})
      },
      shareWechat() {
        this.shareSheet = false
        this.shareWechatDialog = true
      },
      topRefresh(id) {
        this.getRedPacket(() => { 
          this.$refs.loadmore.onTopLoaded(id)
        })
      },
      getRedPacket(cb) {
        this.$store.dispatch(types.REDPACKET_GET_REQUEST, { token: this.token, id: this.redPacketId }).then(res => {
          this.toggleLoading(false)
          this.shareMessage = this.$i18n.t('wechat_share_message', {user: this.user.showname, num: res.recipients, token: res.token.name, link: res.short_url || res.link})
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
      gotoToken() {
        this.$router.push({ path: '/token/' + (this.redPacket.token.address || 'ETH') })
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
      this.redPacketId = parseInt(this.$route.params.id)
    },
    mounted() {
      if (!this.redPacketId || this.redPacketId.id !== this.redPacketId) {
        this.toggleLoading(true)
        this.getRedPacket()
      }
      bus.$emit('changeTab', '')
      bus.$emit('showGoback', true)
      bus.$emit('update_toolbar_items', null)
      bus.$emit('update_toolbar_icons', null)
    }
  }

</script>