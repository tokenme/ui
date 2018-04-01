import axios from 'axios'

export default {
  get(q) {
    return axios.get('/token/get', {
      params: {
        q: q
      }
    }).then((response) => {
      return response.data
    }).catch((err) => {
      if (err.response) {
        if (err.response.data) {
          return err.response.data.code ? err.response.data : {
            code: 1,
            message: err.response.data
          }
        }
        return {
          code: err.response.status,
          message: 'unauthorized'
        }
      }
      return {
        code: 1,
        message: err
      }
    })
  },
  market(q) {
    return axios.get('/token/market', {
      params: {
        q: q
      }
    }).then((response) => {
      return response.data
    }).catch((err) => {
      if (err.response) {
        if (err.response.data) {
          return err.response.data.code ? err.response.data : {
            code: 1,
            message: err.response.data
          }
        }
        return {
          code: err.response.status,
          message: 'unauthorized'
        }
      }
      return {
        code: 1,
        message: err
      }
    })
  },
  graph(payload) {
    return axios.get('/token/graph', {
      params: payload
    }).then((response) => {
      return response.data
    }).catch((err) => {
      if (err.response) {
        if (err.response.data) {
          return err.response.data.code ? err.response.data : {
            code: 1,
            message: err.response.data
          }
        }
        return {
          code: err.response.status,
          message: 'unauthorized'
        }
      }
      return {
        code: 1,
        message: err
      }
    })
  }
}