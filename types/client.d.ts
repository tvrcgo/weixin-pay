
declare global {

  interface WeixinClientOptions {
    appId: number
    mchId: number
    serialNo: string
    privateKeyPath: string
    publicCertPath?: string
    apiKey: string
  }

  interface WeixinClientParams extends WeixinClientOptions {
    privateKey: string
    publicKey?: string
  }
}

export {}
