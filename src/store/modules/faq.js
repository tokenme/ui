import * as types from '../mutation-types'
import faqAPI from '../../api/faq'

// initial state
const state = {
  faq: null
}

// getters
const getters = {
  faq: state => state.faq,
  getByLocale: state => (locale) => {
    if (!state.faq) {
      return []
    }
    if (!state.faq[locale]) {
      return state.faq['en']
    }
    return state.faq[locale]
  }
}

// actions
const actions = {
  [types.FAQ_REQUEST]({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      faqAPI.get().then((response) => {
        if (response.code) {
          commit(types.FAQ_FAILURE, response)
          reject(response)
          return
        }
        commit(types.FAQ_SUCCESS, response)
        resolve(response)
      })
    })
  }
}

// mutations
const mutations = {

  [types.FAQ_SUCCESS](state, data) {
    state.faq = data
  },

  [types.FAQ_FAILURE](state, err) {}
}

export default {
  state,
  getters,
  actions,
  mutations
}