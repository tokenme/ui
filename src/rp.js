import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'
import SocialSharing from 'vue-social-sharing'
import MetaInfo from 'vue-meta-info'
import gtagjs from 'vue-gtagjs'

import App from './RedPacketApp.vue'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import ResetPassword from './components/ResetPassword.vue'
import RedPacketShow from './components/RedPacketShow.vue'
import RedPackets from './components/RedPackets.vue'
import RedPacket from './components/RedPacket.vue'
import UserInfo from './components/UserInfo.vue'
import Fund from './components/Fund.vue'
import AddRedPacket from './components/AddRedPacket.vue'
import Faq from './components/Faq.vue'
import Token from './components/Token.vue'
import store from './store'
import i18nCommon from './locale/common'
import * as types from './store/mutation-types'

Vue.use(VueI18n)
Vue.use(VueRouter)
Vue.use(VueClipboard)
Vue.use(SocialSharing)
Vue.use(MetaInfo)
Vue.use(Vuetify)

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
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: 'login',
      showToolBar: true
    }
  }, {
    name: 'register',
    path: '/register',
    component: Register,
    meta: {
      title: 'register',
      showToolBar: true
    }
  }, {
    name: 'resetPassword',
    path: '/reset-password',
    component: ResetPassword,
    meta: {
      title: 'resetPassword',
      showToolBar: true
    }
  }, {
    name: 'redPackets',
    path: '/red-packets',
    component: RedPackets,
    meta: {
      auth: true,
      title: 'redpackets',
      showToolBar: true,
      showTab: true
    }
  }, {
    name: 'red-packet',
    path: '/red-packet/:id',
    component: RedPacket,
    meta: {
      auth: true,
      title: 'red-packet',
      showToolBar: true,
      showTab: true
    }
  }, {
    name: 'cash',
    path: '/',
    component: Fund,
    meta: {
      auth: true,
      title: 'fund',
      showToolBar: true,
      showTab: true
    },
    props: {
      cashOnly: true
    }
  }, {
    name: 'wallet',
    path: '/wallet',
    component: Fund,
    meta: {
      auth: true,
      title: 'fund',
      showToolBar: true,
      showTab: true
    },
    props: {
      walletOnly: true
    }
  }, {
    name: 'addRedPacket',
    path: '/add-red-packet',
    component: AddRedPacket,
    meta: {
      auth: true,
      title: 'red-packets',
      showToolBar: true,
      showTab: true
    }
  }, {
    name: 'fund',
    path: '/fund',
    component: Fund,
    meta: {
      auth: true,
      title: 'wallet',
      showToolBar: true,
      showTab: true
    }
  }, {
    name: 'userInfo',
    path: '/user/info',
    component: UserInfo,
    meta: {
      auth: true,
      title: 'userinfo',
      showToolBar: true,
      showTab: true
    }
  }, {
    name: 'rp',
    path: '/show/:key',
    component: RedPacketShow,
    meta: {
      checkAuth: true,
      title: 'red-packet-show',
      showToolBar: false,
      showFooter: true
    }
  }, {
    name: 'token',
    path: '/token/:key',
    component: Token,
    meta: {
      title: 'token',
      showToolBar: true,
      showTab: true
    }
  }, {
    name: 'faq',
    path: '/faq',
    component: Faq,
    meta: {
      title: 'faq',
      showToolBar: true,
      showTab: true
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

const GA_TRACKING_ID = 'UA-116680246-2'
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
        const user = store.getters['userInfo']
        if (window.gtag && user) {
          window.gtag('config', GA_TRACKING_ID, {
            'user_id': user.id,
            'username': user.showname
          })
        }
        next()
      } catch (e) {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    } else if (to.matched.some(record => record.meta.checkAuth)){
      try {
        await store.dispatch(types.JWT_REQUEST)
        await store.dispatch(types.USER_INFO_REQUEST)
        const user = store.getters['userInfo']
        if (window.gtag && user) {
          window.gtag('config', GA_TRACKING_ID, {
            'user_id': user.id,
            'username': user.showname
          })
        }
        next()
      } catch (e) {
        next()
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