import crypto from 'crypto'
import WeixinClient from './client'
import { nonce } from './utils'
import {
  WeixinClientOptions,
  WeixinNoticeResponse,
  WeixinPaymentType
} from '../types'

class WeixinPayment extends WeixinClient {
  constructor(opts: WeixinClientOptions) {
    super(opts)
  }

  // 创建交易单 (JSAPI/H5/App/Native)
  async invokePayment(type: WeixinPaymentType, params: any) {
    params = {
      ...params,
      appid: this.params.appId,
      mchid: this.params.mchId
    }
    const { data } = await this.request('POST', `/v3/pay/transactions/${type}`, params)
    return this.buildParams(type, data)
  }

  // 构造发起支付所需的参数
  private buildParams(type: WeixinPaymentType, params: any) {
    // JSAPI/小程序
    if (type === 'jsapi') {
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
      const sign = this.RSASign(message)

      return {
        ok: 1,
        params: {
          appId: this.params.appId,
          timeStamp: '' + timeStamp,
          nonceStr,
          package: pkgstr,
          signType: 'RSA',
          paySign: sign,
        }
      }
    }

    // H5
    if (type === 'h5') {
      return {
        ok: 1,
        params
      }
    }

    return {
      ok: 0,
      error: 'Unknown payment type'
    }
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

  // 微信平台通知解密
  async decipherWeixinNotice(res: WeixinNoticeResponse) {
    const ciphertext = Buffer.from(decodeURIComponent(res.resource.ciphertext), 'base64')
    const data = ciphertext.slice(0, ciphertext.length - 16)
    const authTag = ciphertext.slice(ciphertext.length - 16)

    const decipher = crypto.createDecipheriv('aes-256-gcm', this.params.apiKey, res.resource.nonce)
    decipher.setAuthTag(authTag)
    decipher.setAAD(Buffer.from(res.resource.associated_data))
    let decrypted = decipher.update(data, undefined, 'utf8')
    decrypted += decipher.final()

    try {
      return JSON.parse(decrypted)
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
