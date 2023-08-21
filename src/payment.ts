import crypto from 'crypto'
import WeixinClient from './client'
import { nonce } from './utils'
import {
  WeixinClientOptions,
  WeixinNoticeResponse
} from '../types'

class WeixinPayment extends WeixinClient {
  constructor(opts: WeixinClientOptions) {
    super(opts)
  }

  // 创建交易单 (JSAPI/H5/App/Native)
  async makeTransaction(type, params) {
    params = {
      ...params,
      appid: this.params.appId,
      mchid: this.params.mchId
    }
    return this.request('POST', `/v3/pay/transactions/${type}`, params)
  }

  // 查询交易
  async queryTransaction(txnId) {
    return this.request('GET', `/v3/pay/transactions/id/${txnId}?mchid=${this.params.mchId}`)
  }

  // 关闭交易
  async closeTransaction(outTradeNo) {
    return this.request('POST', `/v3/pay/transactions/out-trade-no/${outTradeNo}/close`, {
      mchid: this.params.mchId
    })
  }

  // 调起支付
  invokePayment(type, params) {
    // 小程序
    if (type === 'mp') {
      const { prepay_id } = params
      const timeStamp = Math.floor(Date.now() / 1000)
      const nonceStr = nonce()
      const pkgstr = `prepay_id=${prepay_id}`
      const message = [
        this.params.appId,
        timeStamp,
        nonceStr,
        pkgstr,
      ].map(v => v + '\n').join('')
      const sign = this.sign(message)

      return {
        appId: this.params.appId,
        timeStamp: '' + timeStamp,
        nonceStr,
        package: pkgstr,
        signType: 'RSA',
        paySign: sign,
      }
    }

    return {
      error: 'Unknown payment type'
    }
  }

  // 微信平台通知解密
  async decipherWeixinNotice(res: WeixinNoticeResponse) {
    const ciphertext = Buffer.from(res.resource.ciphertext, 'base64')
    const data = ciphertext.slice(0, ciphertext.length - 16)
    const authTag = ciphertext.slice(ciphertext.length - 16)

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.params.apiKey, res.resource.nonce)
    decipher.setAuthTag(authTag)
    decipher.setAAD(Buffer.from(res.resource.associated_data))
    const decoded = decipher.update(data, undefined, 'utf8')
    decipher.final()

    try {
      return JSON.parse(decoded)
    } catch (err) {
      return { error: err.message }
    }
  }

  // 申请退款
  async applyRefund() {}

  // 查询单笔退款
  async queryRefund() {}

  // 申请交易账单
  async applyTradeBill() {}

  // 申请资金账单
  async applyFundBill() {}

  // 下载账单
  async downloadBill() {}

  // 获取商户当前可用的平台证书
  async certificates() {
    return this.request('GET', '/v3/certificates')
  }

}

export default WeixinPayment
