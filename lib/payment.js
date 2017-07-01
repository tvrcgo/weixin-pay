const axios = require('axios')
const { md5, nonce, xml2json, json2xml } = require('./helper')

class WeixinPayment {
  constructor(opts = {}) {
    this.$opts = opts
    this.$ids = { appid: opts.appid, mch_id: opts.mch_id }
    this.$req = axios.create({
      baseURL: 'https://api.mch.weixin.qq.com',
      timeout: 1000*5
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
    Object.assign(params, this.$ids, {
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

module.exports = WeixinPayment
