import crypto from 'crypto'
import fs from 'fs'
import axios, { AxiosInstance } from 'axios'
import { nonce } from './utils'

export interface WeixinRequestParams {
  baseURL?: string
  appId: number
  mchId: number
  mchCertSN: string
  mchKeyPath: string
  wxCertPath: string
  apiKey: string
}

export default class WeixinRequest {
  private _client: AxiosInstance
  private _params: any

  constructor(params: WeixinRequestParams) {
    const {
      mchKeyPath
    } = params
    this._params = {
      ...params,
      mchKey: fs.readFileSync(mchKeyPath, "utf8")
    }
    this._client = axios.create({
      baseURL: 'https://api.mch.weixin.qq.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  }

  get params() {
    return this._params
  }

  buildAuthHeader(params: any) {
    const {
      method,
      url,
      body
    } = params
    const time = Math.floor(Date.now() / 1000)
    const nonceStr = nonce()
    // sign
    const message = [
      method,
      url,
      time,
      nonceStr,
      body
    ].map(v => v + '\n').join('')
    const signature = crypto.createSign('RSA-SHA256').update(message).sign(this._params.mchKey, 'base64')
    // authorization header
    const authParams = {
      mchid: this._params.mchId,
      nonce_str: nonceStr,
      signature: signature,
      timestamp: time,
      serial_no: this._params.mchCertSN
    }
    return {
      Authorization: `WECHATPAY2-SHA256-RSA2048 ${Object.entries(authParams).map(([k, v]) => `${k}="${v}"`).join(',')}`
    }
  }

  async request(method: string, url: string, body: any = '', headers: any = {}) {
    // intercept request
    this._client.interceptors.request.use(config => {
      // add Authorization header
      config.headers = {
        ...config.headers,
        ...this.buildAuthHeader({
          method,
          url,
          body: JSON.stringify(body)
        })
      }
      return config
    })
    // make request
    return this._client.request({
      method,
      url,
      data: body,
      headers: headers
    }).then(res => ({
      status: res.status,
      data: res.data
    })).catch(err => ({
      status: err.response.status,
      data: err.response.data
    }))
  }
}
