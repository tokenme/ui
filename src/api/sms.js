import axios from 'axios'

export default {
  authSend(payload) {
    return axios.post('/auth/send', payload).then((response) => {
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
  authVerify(payload) {
    return axios.post('/auth/verify', payload).then((response) => {
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