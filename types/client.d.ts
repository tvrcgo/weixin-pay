
export interface WeixinClientOptions {
  appId: number
  mchId: number
  serialNo: string
  privateKeyPath: string
  publicCertPath?: string
  apiKey: string
}

export interface WeixinClientParams extends WeixinClientOptions {
  privateKey: string
  publicKey?: string
}
