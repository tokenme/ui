import * as types from '../mutation-types'
import redPacketAPI from '../../api/red-packet'

// initial state
const state = {
  redPackets: [],
  redPacket: null
}

// getters
const getters = {
  redPackets: state => state.redPackets,
  getRedPacketById: state => (id) => {
    if (state.redPacket && state.redPacket.id === id) {
      return state.redPacket
    }
    const filtered = state.redPackets.filter(c => c.id === id)
    return filtered ? filtered[0] : null
  }
}

// actions
const actions = {
  [types.REDPACKET_LIST_REQUEST]({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      redPacketAPI.list(payload.token, payload.params).then((response) => {
        if (response && response.code) {
          commit(types.REDPACKET_LIST_FAILURE, response)
          reject(response)
          return
        }
        commit(types.REDPACKET_LIST_SUCCESS, { refresh: payload.params.page <= 1, redPackets: response || [] })
        resolve(response)
      })
    })
  },
  [types.REDPACKET_GET_REQUEST]({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      redPacketAPI.get(payload.token, { id: payload.id }).then((response) => {
        if (response && response.code) {
          commit(types.REDPACKET_GET_FAILURE, response)
          reject(response)
          return
        }
        commit(types.REDPACKET_GET_SUCCESS, response)
        resolve(response)
      })
    })
  }
}

// mutations
const mutations = {

  [types.REDPACKET_LIST_SUCCESS](state, res) {
    if (res.refresh) {
      state.redPackets = res.redPackets
    } else {
      state.redPackets = [...state.redPackets, ...res.redPackets]
    }
  },

  [types.REDPACKET_LIST_FAILURE](state, err) {},

  [types.REDPACKET_GET_SUCCESS](state, res) {
    state.redPacket = res
  },

  [types.REDPACKET_GET_FAILURE](state, err) {
    state.redPacket = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}