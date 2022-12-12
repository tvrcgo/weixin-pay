
export interface WeixinRequestOptions {
  appId: number
  mchId: number
  serialNo: string
  privateKeyPath: string
  publicCertPath?: string
  apiKey: string
}

export interface WeixinRequestParams extends WeixinRequestOptions {
  privateKey: string
  publicKey?: string
}
