import assert from 'assert'
import { resolve } from 'path'
import Payment from '../src/index'

describe('payment', () => {
  const payment = new Payment({
    appId: 'wx2421b1c4370ec43b',
    mchId: '10000100',
    serialNo: '',
    privatePem: resolve(__dirname, 'cert/private_key.pem'),
  })

  it('get certificates', async () => {
    const res = await payment.certificates()
    assert(res.status === 200)
  })
})
