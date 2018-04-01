import * as types from '../mutation-types'
import promotionAPI from '../../api/promotion'

// initial state
const state = {
  promotions: [],
  promotion: null
}

// getters
const getters = {
  promotions: state => state.promotions,
  getPromotionById: state => (id) => {
    if (state.promotion && state.promotion.id === id) {
      return state.promotion
    }
    const filtered = state.promotions.filter(c => c.id === id)
    return filtered ? filtered[0] : null
  }
}

// actions
const actions = {
  [types.PROMOTION_LIST_REQUEST]({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      promotionAPI.list(payload.token, payload.params).then((response) => {
        if (response && response.code) {
          commit(types.PROMOTION_LIST_FAILURE, response)
          reject(response)
          return
        }
        commit(types.PROMOTION_LIST_SUCCESS, { refresh: payload.params.page <= 1, promotions: response || [] })
        resolve(response)
      })
    })
  },
  [types.PROMOTION_GET_REQUEST]({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      promotionAPI.get(payload.token, { id: payload.id }).then((response) => {
        if (response && response.code) {
          commit(types.PROMOTION_GET_FAILURE, response)
          reject(response)
          return
        }
        commit(types.PROMOTION_GET_SUCCESS, response)
        resolve(response)
      })
    })
  }
}

// mutations
const mutations = {

  [types.PROMOTION_LIST_SUCCESS](state, res) {
    if (res.refresh) {
      state.promotions = res.promotions
    } else {
      state.promotions = [...state.promotions, ...res.promotions]
    }
  },

  [types.PROMOTION_LIST_FAILURE](state, err) {},

  [types.PROMOTION_GET_SUCCESS](state, res) {
    state.promotion = res
  },

  [types.PROMOTION_GET_FAILURE](state, err) {
    state.promotion = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}