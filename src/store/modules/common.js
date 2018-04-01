import * as types from '../mutation-types'

// initial state
// shape: [{ id, quantity }]
const state = {
  loading: false,
  errDialog: null,
  showErrDialog: false,
  snackbar: null,
  showSnackbar: false
}

// getters
const getters = {
  loading: state => state.loading,
  errDialog: state => state.errDialog || { title: '', message: '' },
  showErrDialog: state => state.showErrDialog,
  snackbar: state => state.snackbar || { message: '' },
  showSnackbar: state => state.showSnackbar
}

// actions
const actions = {
  [types.SHOW_LOADING]({
    commit,
    state
  }) {
    commit(types.SHOW_LOADING)
  },
  [types.HIDE_LOADING]({
    commit,
    state
  }) {
    commit(types.HIDE_LOADING)
  },

  [types.SHOW_ERROR_DIALOG]({
    commit,
    state
  }, error) {
    commit(types.SHOW_ERROR_DIALOG, error)
  },
  [types.HIDE_ERROR_DIALOG]({
    commit,
    state
  }) {
    commit(types.HIDE_ERROR_DIALOG)
  },

  [types.SHOW_SNACKBAR]({
    commit,
    state
  }, msg) {
    commit(types.SHOW_SNACKBAR, msg)
  },
  [types.HIDE_SNACKBAR]({
    commit,
    state
  }) {
    commit(types.HIDE_SNACKBAR)
  }
}

// mutations
const mutations = {

  [types.SHOW_LOADING](state) {
    state.loading = true
  },

  [types.HIDE_LOADING](state) {
    state.loading = false
  },

  [types.SHOW_ERROR_DIALOG](state, error) {
    state.errDialog = error
    state.showErrDialog = true
  },

  [types.HIDE_ERROR_DIALOG](state) {
    state.showErrDialog = false
    state.errDialog = null
  },
  [types.SHOW_SNACKBAR](state, msg) {
    state.snackbar = msg
    state.showSnackbar = true
  },

  [types.HIDE_SNACKBAR](state) {
    state.showSnackbar = false
    state.snackbar = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}