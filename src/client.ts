import crypto from 'crypto'
import fs from 'fs'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { nonce } from './utils'
import {
  WeixinClientParams,
  WeixinClientOptions
} from '../types'

class WeixinClient {
  private _client: AxiosInstance
  private _params: WeixinClientParams

  constructor(opts: WeixinClientOptions) {
    const {
      privateKeyPath
    } = opts
    this._params = {
      ...opts,
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
    // intercept request
    this._client.interceptors.request.use((config: AxiosRequestConfig) => {
      return config
    })
    // intercept response
    this._client.interceptors.response.use((res: AxiosResponse) => {
      return res
    }, (err: AxiosError) => {
      if (err && err.response) {
        return err.response
      } else {
        return {
          error: err.message || err.code
        }
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
    // make request
    return this._client.request({
      method,
      url,
      data: body,
      headers: {
        ...headers,
        ...this.buildAuthHeader({
          method,
          url,
          body: JSON.stringify(body)
        })
      }
    })
  }
}

export default WeixinClient
