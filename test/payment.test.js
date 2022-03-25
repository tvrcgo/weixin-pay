import assert from 'assert'
import { resolve } from 'path'
import { Payment } from '../src/index'

describe('payment', () => {
  const payment = new Payment({
    appId: 'wx00000', // 公众号ID
    mchId: '1000010', // 商户ID
    serialNo: 'xxx', // 商户API证书序列号
    privateKeyPath: resolve(__dirname, './cert/apiclient_key.pem'), // 商户API私钥
    apiKey: 'xxx', // API v3 密钥
  })

  it('get certificates', async () => {
    const res = await payment.certificates()
    assert(res.status === 200)
  })

  it('make h5 transaction', async () => {
    const res = await payment.makeTransaction({
      type: 'h5',
      params: {
        description: '小玩具 H5',
        out_trade_no: '123456789',
        notify_url: 'https://monitor-hook.fc.lazada.cn/itrace',
        amount: {
          total: 1,
          currency: 'CNY'
        },
        scene_info: {
          payer_client_ip: "127.0.0.1",
          h5_info: {
            type: "Wap"
          }
        }
      }
    })
    assert(res.status === 200)
  })

})
