import crypto from 'crypto'
import fs from 'fs'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { nonce } from './utils'

interface WeixinRequestOptions {
  appId: number
  mchId: number
  serialNo: string
  privateKeyPath: string
  publicCertPath?: string
  apiKey: string
}

interface WeixinRequestParams extends WeixinRequestOptions {
  privateKey: string
  publicKey?: string
}

class WeixinRequest {
  private _client: AxiosInstance
  private _params: WeixinRequestParams

  constructor(params: WeixinRequestOptions) {
    const {
      privateKeyPath
    } = params
    this._params = {
      ...params,
      privateKey: fs.readFileSync(privateKeyPath, "utf8")
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

  private buildAuthHeader(params: any) {
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
    const signature = crypto.createSign('RSA-SHA256').update(message).sign(this._params.privateKey, 'base64')
    // authorization header
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

  async request(method: string, url: string, body: any = '', headers: any = {}) {
    // intercept request
    this._client.interceptors.request.use((config: AxiosRequestConfig) => {
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
    }).then((res: AxiosResponse) => ({
      status: res.status,
      data: res.data
    })).catch((err: AxiosError) => {
      if (err && err.response) {
        return {
          status: err.response.status,
          data: err.response.data
        }
      } else {
        return {
          error: err.message || err.code
        }
      }
    })
  }
}

export default WeixinRequest
export {
  WeixinRequestOptions
}
