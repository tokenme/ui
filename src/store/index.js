import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import locale from './modules/locale'
import user from './modules/user'
import channel from './modules/channel'
import adzone from './modules/adzone'
import airdrop from './modules/airdrop'
import promotion from './modules/promotion'
import redpacket from './modules/redpacket'
import faq from './modules/faq'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    common,
    locale,
    user,
    channel,
    adzone,
    airdrop,
    promotion,
    redpacket,
    faq
  },
  strict: debug
})