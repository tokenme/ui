import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'
import SocialSharing from 'vue-social-sharing'
import gtagjs from 'vue-gtagjs'

import App from './App.vue'
import UserInfo from './components/UserInfo.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import ResetPassword from './components/ResetPassword.vue'
import Channels from './components/Channels.vue'
import Adzones from './components/Adzones.vue'
import Airdrops from './components/Airdrops.vue'
import Airdrop from './components/Airdrop.vue'
import AddAirdrop from './components/AddAirdrop.vue'
import Promotions from './components/Promotions.vue'
import Promotion from './components/Promotion.vue'
import RedPackets from './components/RedPackets.vue'
import RedPacket from './components/RedPacket.vue'
import Token from './components/Token.vue'
//import AddRedPacket from './components/AddRedPacket.vue'
import Fund from './components/Fund.vue'
import store from './store'
import i18nCommon from './locale/common'
import * as types from './store/mutation-types'

Vue.use(VueI18n)
Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(VueClipboard)
Vue.use(SocialSharing)

const i18n = new VueI18n(i18nCommon)

store.dispatch(types.GET_LOCALE_REQUEST).then((locale) => {
  if (!locale) {
    i18n.locale = 'en'
    return
  }
  i18n.locale = locale
})

store.dispatch(types.GET_COUNTRY_CODE_REQUEST)

const router = new VueRouter({
  routes: [{
    name: 'home',
    path: '/',
    component: Airdrops,
    meta: {
      auth: true,
      title: 'airdrops',
      hideFooter: true
    }
  }, {
    name: 'userInfo',
    path: '/user/info',
    component: UserInfo,
    meta: {
      auth: true,
      title: 'userinfo',
      hideFooter: false
    }
  }, {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: 'login',
      hideFooter: true
    }
  }, {
    name: 'register',
    path: '/register',
    component: Register,
    meta: {
      title: 'register',
      hideFooter: true
    }
  }, {
    name: 'resetPassword',
    path: '/reset-password',
    component: ResetPassword,
    meta: {
      title: 'resetPassword',
      hideFooter: true
    }
  }, {
    name: 'channels',
    path: '/channels',
    component: Channels,
    meta: {
      auth: true,
      title: 'channels',
      hideFooter: true
    }
  }, {
    name: 'channel',
    path: '/channel/:id',
    component: Adzones,
    meta: {
      auth: true,
      title: 'channel',
      hideFooter: true
    }
  }, {
    name: 'airdrops',
    path: '/airdrops',
    component: Airdrops,
    meta: {
      auth: true,
      title: 'airdrops',
      hideFooter: true
    }
  }, {
    name: 'add_airdrop',
    path: '/airdrop/add',
    component: AddAirdrop,
    meta: {
      auth: true,
      title: 'add_airdrop',
      hideFooter: true
    }
  }, {
    name: 'airdrop',
    path: '/airdrop/:id',
    component: Airdrop,
    meta: {
      auth: true,
      title: 'airdrop',
      hideFooter: true
    }
  }, {
    name: 'promotions',
    path: '/promotions',
    component: Promotions,
    meta: {
      auth: true,
      title: 'promotions',
      hideFooter: true
    }
  }, {
    name: 'promotion',
    path: '/promotion/:id',
    component: Promotion,
    meta: {
      auth: true,
      title: 'promotion',
      hideFooter: true
    }
  }, {
    name: 'red-packets',
    path: '/red-packets',
    component: RedPackets,
    meta: {
      auth: true,
      title: 'red-packets',
      hideFooter: true
    }
  }, {
    name: 'red-packet',
    path: '/red-packet/:id',
    component: RedPacket,
    meta: {
      auth: true,
      title: 'red-packet',
      hideFooter: true
    }
  }, {
    name: 'fund',
    path: '/fund',
    component: Fund,
    meta: {
      auth: true,
      title: 'fund',
      hideFooter: true
    }
  }, {
    name: 'token',
    path: '/token/:key',
    component: Token,
    meta: {
      title: 'token',
      hideFooter: true
    }
  }],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

const GA_TRACKING_ID = 'UA-116680246-1'
gtagjs(router, GA_TRACKING_ID)
Vue.prototype.GA_TRACKING_ID = GA_TRACKING_ID

if (window.performance && window.gtag) {
  // Gets the number of milliseconds since page load
  // (and rounds the result since the value must be an integer).
  var timeSincePageLoad = Math.round(performance.now())

  // Sends the timing event to Google Analytics.
  window.gtag('event', 'timing_complete', {
    'name': 'load',
    'value': timeSincePageLoad,
    'event_category': 'Start Render'
  })
}

if (window.Raven) {
  window.Raven.config('https://8e1767d8d7b94183805e4d1515665468@sentry.io/994578').install()
}

router.beforeEach((to, from, next) => {
  const runner = async() => {
    if (to.matched.some(record => record.meta.auth)) {
      try {
        await store.dispatch(types.JWT_REQUEST)
        await store.dispatch(types.USER_INFO_REQUEST)
        next()
      } catch (e) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    } else {
      next()
    }
  }
  runner()
})

/* eslint-disable no-new*/
try {
  new Vue({
    i18n,
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
  })
} catch (e) {
  if (window.gtag) {
    window.gtag('event', 'exception', {
      'description': e,
      'fatal': false
    })
  }
}
/* eslint-enable no-new*/