
import crypto from 'crypto'
import fs from 'fs'
import axios from 'axios'
import { nonce } from './utils'

class WeixinPayment {
  _client: any
  _params: any

  constructor(params: any) {
    const {
      baseUrl,
      privatePem,
    } = params
    this._params = {
      ...params,
      privateKey: fs.readFileSync(privatePem, "utf8")
    }
    this._client = axios.create({
      baseURL: baseUrl || 'https://api.mch.weixin.qq.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  buildAuthHeader(params: any) {
    const {
      method,
      url,
      body
    } = params
    // sign
    const time = Math.floor(Date.now() / 1000)
    const nonceStr = nonce()
    const message = [
      method,
      url,
      time,
      nonceStr,
      body
    ].map(v => v + '\n').join('')
    const signature = crypto.createHmac('sha256', this._params.privateKey).update(message).digest('base64')
    // build header
    const authParams = {
      mchid: this._params.mchId,
      nonce_str: nonceStr,
      signature: signature,
      timestamp: time,
      serial_no: this._params.serialNo
    }
    return {
      Authorization: `WECHATPAY2-SHA256-RSA2048 ${Object.entries(authParams).map(([k, v]) => `${k}="${v}"`).join(',')}`
    }
  }

  async request(method, url, body) {
    const authHeader = this.buildAuthHeader({
      method,
      url,
      body
    })
    return this._client.request({
      method,
      url,
      data: body,
      headers: {
        ...authHeader,
      }
    }).then(res => ({
      status: res.status,
      data: res.data
    })).catch(err => ({
      status: err.response.status,
      data: err.response.data
    }))
  }

  // 签名验证
  async certificates() {
    return this.request('GET', '/v3/certificates', '')
  }

  // 创建预支付交易单
  async createTransaction() {}

  // 查询交易单
  async queryTransaction() {}

  // 关闭交易单
  async closeTransaction() {}

  // 调起支付
  async invokePayment() {}

  // 通知支付结果
  async notifyPaymentResult() {}

  // 申请退款
  async applyRefund() {}

  // 查询单笔退款
  async queryRefund() {}

  // 通知退款结果
  async notifyRefundResult() {}

  // 申请交易账单
  async applyTradeBill() {}

  // 申请资金账单
  async applyFundflowBill() {}

  // 下载账单
  async downloadBill() {}

}

export default WeixinPayment
