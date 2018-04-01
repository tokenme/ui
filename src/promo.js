import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'
import gtagjs from 'vue-gtagjs'

import App from './PromoApp.vue'
import Promo from './components/Promo.vue'
import Token from './components/Token.vue'
import store from './store'
import i18nCommon from './locale/common'
import * as types from './store/mutation-types'

Vue.use(VueI18n)
Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(VueClipboard)

const i18n = new VueI18n(i18nCommon)
store.dispatch(types.GET_LOCALE_REQUEST).then((locale) => {
  if (!locale) {
    i18n.locale = 'en'
    return
  }
  i18n.locale = locale
})

const router = new VueRouter({
  routes: [{
    name: 'promo',
    path: '/:key',
    component: Promo,
    meta: {
      title: 'promo'
    }
  }, {
    name: 'token',
    path: '/token/:key',
    component: Token,
    meta: {
      title: 'token'
    }
  }]
})

const GA_TRACKING_ID = 'UA-116680246-3'
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

router.beforeEach((to, from, next) => {
  next()
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