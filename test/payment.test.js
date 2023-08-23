import assert from 'assert'
import { resolve } from 'path'
import { Payment } from '@/index'

require('dotenv').config()

describe('payment', () => {
  const payment = new Payment({
    appId: process.env.WX_APP_ID, // 公众号ID
    mchId: process.env.WX_MCH_ID, // 商户ID
    serialNo: process.env.WX_SERIAL_NO, // 商户API证书序列号
    privateKeyPath: resolve(__dirname, './cert/apiclient_key.pem'), // 商户API私钥
    apiKey: process.env.WX_API_KEY, // API v3 密钥
  })
  const openid = process.env.WX_OPENID

  it('get certificates', async () => {
    const res = await payment.certificates()
    assert(res.status === 200)
  })

  it('make transaction', async () => {
    const res = await payment.makeTransaction('jsapi', {
      description: '娃哈哈',
      out_trade_no: ('' + Date.now()).replace(/\./, ''),
      notify_url: 'https://api.tvrcgo.cn/v1/weixin/pay_notify',
      amount: {
        total: 1,
        currency: 'CNY'
      },
      payer: {
        openid: openid,
      }
    })
    assert(res.status === 200)
    assert(res.data.prepay_id)
  })

})
