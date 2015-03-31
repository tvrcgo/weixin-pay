# weixin-pay
微信支付 for node.js

## Installation
```
npm install weixin-pay
```

## Usage

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

### 公众号支付

生成JS API支付参数，发给页面
```js
wxpay.getBrandWCPayRequestParams({
	openid: '微信用户 openid',
	body: '公众号支付测试',
    detail: '公众号支付测试',
	out_trade_no: '20150331'+Math.random().toString().substr(2, 10),
	total_fee: 1,
	spbill_create_ip: '192.168.2.210',
	notify_url: 'http://wxpay_notify_url'
}, function(err, result){
	// in express
    res.render('wxpay/jsapi', { payargs:result })
});
```

网页调用参数（以ejs为例）
```js
WeixinJSBridge.invoke(
	"getBrandWCPayRequest", <%-JSON.Stringify(payargs)%>, function(res){
		if(res.err_msg == "get_brand_wcpay_request:ok" ) {
    		// success
    	}
});
```

### 中间件

商户服务端处理微信的回调（express为例）
```js
var router = express.Router();
var wxpay = require('weixin-pay');

// 原生支付回调
router.use('/wxpay/native/callback', wxpay.useWXCallback(function(msg, req, res, next){
	// msg: 微信回调发送的数据
}));

// 支付结果异步通知
router.use('/wxpay/notify', wxpay.useWXCallback(function(msg, req, res, next){

}));
```
