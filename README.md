# weixin-pay
微信支付 for node.js

### Installation
```
npm install weixin-pay
```

### Usage

创建统一支付订单

```js
var WXPay = require('weixin-pay');

var wxpay = WXPay({
	appid: 'xxxxxxxx',
	mch_id: '1234567890',
	partner_key: 'xxxxxxxxxxxxxxxxx',
	pfx: fs.readFileSync('./wxpay_cert.p12'),
});

wxpay.createUnifiedOrder({
	body: '扫码支付测试',
	out_trade_no: '20140703'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://wxpay_notify_url',
	trade_type: 'NATIVE',
	product_id: '1234567890'
}, function(err, result){
	console.log(result);
});
```