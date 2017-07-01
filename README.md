# weixin-pay
微信支付 for node.js

[![npm version](https://badge.fury.io/js/weixin-pay.svg)](http://badge.fury.io/js/weixin-pay)

```shell
npm install weixin-pay --save
```

## Usage

```js
const Payment = require('weixin-pay');

const payment = new Payment({
  appid: 'xxxxxxxx',
  mch_id: '1234567890',
  pfx: fs.readFileSync('./wxpay_cert.p12'), //微信商户平台证书
})
```

创建支付订单
```js
payment.createOrder({
  trade_type: 'NATIVE',
  body: '扫码支付测试',
  out_trade_no: '20140703',
  total_fee: 10,
  spbill_create_ip: '192.168.2.210',
  notify_url: 'http://wxpay_notify_url'
})
```

查询订单
```js
// 通过微信订单号查
payment.queryOrder({
  transaction_id:"xxxxxx"
})

// 通过商户订单号查
payment.queryOrder({
  out_trade_no:"xxxxxx"
})
```

撤销订单
```js
payment.reverseOrder({
  out_trade_no:"xxxxxx"
})
```

关闭订单
```js
payment.closeOrder({
  out_trade_no:"xxxxxx"
})
```

退款
```js
payment.refund({
  appid: 'xxxxxxxx',
  mch_id: '1234567890',
  out_refund_no: '20140703xxx',
  total_fee: '1', //原支付金额
  refund_fee: '1', //退款金额
  transaction_id: '微信订单号'
})
```

查询退款
```js
payment.queryRefund({
  out_trade_no: '8729uhf982398f'
})
```

## License
MIT