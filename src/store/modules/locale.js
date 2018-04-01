import * as types from '../mutation-types'
import helperAPI from '../../api/helper'
import { countries } from '../../twilio-countries'
// initial state
// shape: [{ id, quantity }]
const state = {
  locale: '',
  geoip: null,
  countryCode: 0,
  ipCountry: null
}

// getters
const getters = {
  locale: state => {
    if (state.locale) {
      return state.locale
    }
    let lang = 'en'
    if (state.ipCountry && state.ipCountry.lang) {
      lang = state.ipCountry.lang
      return lang
    }
    switch (navigator.language) {
      case 'zh': lang = 'zh_TW'; break
      case 'zh-CN': lang = 'zh_CN'; break
    }
    return lang
  },
  countryCode: state => {
    if (state.countryCode > 0) {
      return state.countryCode
    }
    if (state.ipCountry) {
      return state.ipCountry.code
    }
    return 0
  }
}

// actions
const actions = {
  [types.GET_LOCALE_REQUEST]({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      let locale = localStorage.getItem('locale')
      commit(types.SELECT_LOCALE_REQUEST, locale)
      resolve(locale)
    })
  },
  [types.SELECT_LOCALE_REQUEST]({
    commit,
    state
  }, locale) {
    return new Promise((resolve, reject) => {
      localStorage.setItem('locale', locale)
      commit(types.SELECT_LOCALE_REQUEST, locale)
      resolve(locale)
    })
  },
  [types.GET_COUNTRY_CODE_REQUEST]({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      let countryCode = localStorage.getItem('countryCode')
      commit(types.CHANGE_COUNTRY_CODE_REQUEST, countryCode)
      resolve(countryCode)
    })
  },
  [types.CHANGE_COUNTRY_CODE_REQUEST]({
    commit,
    state
  }, countryCode) {
    return new Promise((resolve, reject) => {
      localStorage.setItem('countryCode', countryCode)
      commit(types.CHANGE_COUNTRY_CODE_REQUEST, countryCode)
      resolve(countryCode)
    })
  },
  [types.GEOIP_REQUEST]({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      helperAPI.geoip().then((response) => {
        if (response.code) {
          commit(types.GEOIP_FAILURE, response)
          reject(response)
          return
        }
        commit(types.GEOIP_SUCCESS, response)
        resolve(response)
      })
    })
  }
}

// mutations
const mutations = {
  [types.SELECT_LOCALE_REQUEST](state, locale) {
    state.locale = locale
  },
  [types.CHANGE_COUNTRY_CODE_REQUEST](state, countryCode) {
    state.countryCode = parseInt(countryCode)
  },
  [types.GEOIP_SUCCESS](state, geoip) {
    if (geoip && geoip.Country) {
      for (const c of countries) {
        if (geoip.Country.IsoCode === c.iso) {
          state.ipCountry = c
          break
        }    
      }
    }
    state.geoip = geoip
  },
  [types.GEOIP_FAILER](state, err) { }
}

export default {
  state,
  getters,
  actions,
  mutations
}