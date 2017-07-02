const assert = require('power-assert')
const Payment = require('../index')

describe('weixin', function() {

  describe('payment', () => {

    const payment = new Payment({
      appid: 'wxd678efh567hg6787',
      mch_id: '1230000109'
    })

    it('create order', function* () {
      const order = yield payment.createOrder({
        trade_type: 'NATIVE',
        body: 'KFC',
        out_trade_no: '8729uhf982398f',
        total_fee: 10,
        spbill_create_ip: '10.84.84.79',
        notify_url: 'http://localhost/weixin/pay/notify',
      })
      assert(order.return_code === 'SUCCESS')
    })

    it('query order', function* () {
      const order = yield payment.queryOrder({
        out_trade_no: '8729uhf982398f', // or transaction_id
      })
      assert(order.return_code === 'SUCCESS')
    })

    it('reverse order', function* () {
      const order = yield payment.reverseOrder({
        out_trade_no: '8729uhf982398f', // or transaction_id
      })
      assert(order.return_code === 'SUCCESS')
    })

    it('close order', function* () {
      const order = yield payment.closeOrder({
        out_trade_no: 'abcdef'
      })
      assert(order.return_code === 'SUCCESS')
    })

    it('query refund', function* () {
      const order = yield payment.queryRefund({
        out_trade_no: '8729uhf982398f', // or transaction_id, out_refund_no, refund_id
      })
      assert(order.return_code === 'SUCCESS')
    })

    it('refund', function* () {
      const order = yield payment.refund({
        out_trade_no: '8729uhf982398f', // or transaction_id
        total_fee: 100,
        refund_fee: 80
      })
      assert(order.return_code === 'SUCCESS')
    })

  })
})