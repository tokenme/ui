import * as types from '../mutation-types'
import faqAPI from '../../api/faq'

// initial state
const state = {
  faq: {
    zh_CN: '',
    zh_TW: '',
    en: ''
  }
}

// getters
const getters = {
  faq: state => state.faq,
  getByLocale: state => (locale) => {
    return state.faq[locale]
  }
}

// actions
const actions = {
  [types.FAQ_REQUEST]({
    commit,
    state
  }, locale) {
    return new Promise((resolve, reject) => {
      faqAPI.get(locale).then((response) => {
        if (response.code) {
          commit(types.FAQ_FAILURE, response)
          reject(response)
          return
        }
        commit(types.FAQ_SUCCESS, {res: response, locale: locale})
        resolve(response)
      })
    })
  }
}

// mutations
const mutations = {

  [types.FAQ_SUCCESS](state, data) {
    state.faq[data.locale] = data.res
  },

  [types.FAQ_FAILURE](state, err) {}
}

export default {
  state,
  getters,
  actions,
  mutations
}