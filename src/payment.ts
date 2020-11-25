const https = require('https')
const axios = require('axios')
const { md5, nonce, xml2json, json2xml } = require('./helper')

class WeixinPayment {
  $opts: any
  $req: any

  constructor(opts: any = {}) {
    this.$opts = opts
    this.$req = axios.create({
      baseURL: 'https://api.mch.weixin.qq.com',
      timeout: 1000*5,
      httpsAgent: new https.Agent({
        pfx: opts.pfx
      })
    })
  }

  sign(params) {
    const qs = Object.keys(params)
      .filter(key => key && params[key] && !['sign'].includes(key))
      .sort()
      .map(key => `${key}=${params[key]}`).join('&')
    return md5(qs).toUpperCase()
  }

  req(url, params) {
    const { appid, mch_id } = this.$opts
    Object.assign(params, {
      appid,
      mch_id,
      nonce_str: nonce()
    })
    params.sign = this.sign(params)
    const body = json2xml(params, { header: false })
    return this.$req
      .post(url, body)
      .then(ret => xml2json(ret.data))
  }

  createOrder(params = {}) {
    return this.req('/pay/unifiedorder', params)
  }

  queryOrder(params = {}) {
    return this.req('/pay/orderquery', params)
  }

  closeOrder(params = {}) {
    return this.req('/pay/closeorder', params)
  }

  reverseOrder(params = {}) {
    return this.req('/secapi/pay/reverse', params)
  }

  refund(params = {}) {
    return this.req('/secapi/pay/refund', params)
  }

  queryRefund(params = {}) {
    return this.req('/pay/refundquery', params)
  }

}

export default WeixinPayment
