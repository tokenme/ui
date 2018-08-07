import axios from 'axios'

export function isWeixinBrowser() {
  let ua = navigator.userAgent.toLowerCase()
  return (/micromessenger/.test(ua))
}

export function getWeixinJs(url) {
  return axios.get('/auth/wechat-mp/get-js?url=' + encodeURIComponent(url)).then((response) => {
    return response.data
  }).catch((err) => {
    console.log(err)
  }) 
}
