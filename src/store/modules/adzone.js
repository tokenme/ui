import * as types from '../mutation-types'
import adzoneAPI from '../../api/adzone'

// initial state
const state = {
  adzones: []
}

// getters
const getters = {
  adzones: state => state.adzones,
  getAdzonesByChannelId: state => (id) => {
    return state.adzones.filter(c => c.channel_id === id)
  }
}

// actions
const actions = {
  [types.ADZONE_LIST_REQUEST]({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      adzoneAPI.list(payload.token, { channel_id: payload.channel_id }).then((response) => {
        if (response && response.code) {
          commit(types.ADZONE_LIST_FAILURE, {channel_id: payload.channel_id, err: response})
          reject(response)
          return
        }
        commit(types.ADZONE_LIST_SUCCESS, { channel_id: payload.channel_id, adzones: response || [] })
        resolve(response)
      })
    })
  },

  [types.ADZONE_ADD_REQUEST]({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      adzoneAPI.add(payload.token, { channel_id: payload.channel_id, name: payload.name }).then((response) => {
        if (response.code) {
          commit(types.ADZONE_ADD_FAILURE, { channel_id: payload.channel_id, err: response })
          reject(response)
          return
        }
        commit(types.ADZONE_ADD_SUCCESS, { channel_id: payload.channel_id, adzones: response })
        resolve(response)
      })
    })
  }
}

// mutations
const mutations = {

  [types.ADZONE_LIST_SUCCESS](state, res) {
    const restAdzones = state.adzones.filter(ad => ad.channel_id !== res.channel_id)
    state.adzones = [...restAdzones, ...res.adzones]
  },

  [types.ADZONE_LIST_FAILURE](state, err) {
    const restAdzones = state.adzones.filter(ad => ad.channel_id !== err.channel_id)
    state.adzones = restAdzones
  },

  [types.ADZONE_ADD_SUCCESS](state) {},
  [types.ADZONE_ADD_FAILURE](state, err) {}
}

export default {
  state,
  getters,
  actions,
  mutations
}