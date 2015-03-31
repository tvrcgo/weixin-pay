
var util = require('./util');
var request = require('request');
var md5 = require('MD5');

exports = module.exports = WXPay;

function WXPay() {
	
	if (!(this instanceof WXPay)) {
		return new WXPay(arguments[0]);
	};

	this.wxpayOptions = arguments[0];
};

WXPay.mix = function(){
	
	switch (arguments.length) {
		case 1:
			var obj = arguments[0];
			for (var key in obj) {
				if (WXPay.prototype.hasOwnProperty(key)) {
					throw new Error('Prototype method exist. method: '+ key);
				}
				WXPay.prototype[key] = obj[key];
			}
			break;
		case 2:
			var key = arguments[0].toString(), fn = arguments[1];
			if (WXPay.prototype.hasOwnProperty(key)) {
				throw new Error('Prototype method exist. method: '+ key);
			}
			WXPay.prototype[key] = fn;
			break;
	}
};


WXPay.mix('sign', function(param){

	var querystring = Object.keys(param).filter(function(key){
		return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
	}).sort().map(function(key){
		return key + '=' + param[key];
	}).join("&") + "&key=" + param.partner_key;

	return md5(querystring).toUpperCase();
});


WXPay.mix('createUnifiedOrder', function(order, fn){

	var opts = util.mix({}, this.wxpayOptions, order);
	opts.nonce_str = opts.nonce_str || util.generateNonceString();
	opts.sign = this.sign(opts);
	var pfx = opts.pfx;

	['pfx', 'partner_key'].forEach(function(key){
		delete opts[key];
	});

	request({
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		method: 'POST',
		body: util.buildXML(opts),
		agentOptions: {
			pfx: pfx,
			passphrase: opts.mch_id
		}
	}, function(err, response, body){
		util.parseXML(body, fn||function(err, result){});
	});
});

WXPay.mix('getBrandWCPayRequestParams', function(order, fn){

	order.trade_type = "JSAPI";
	var _this = this;
	this.createUnifiedOrder(order, function(err, data){
		fn(err, {
			appId: _this.wxpayOptions.appid,
			timeStamp: Math.floor(Date.now()/1000),
			nonceStr: data.nonce_str,
			package: "prepay_id="+data.prepay_id,
			signType: "MD5",
			paySign: data.sign
		});
	});
});

WXPay.mix('createMerchantPrepayUrl', function(param){

	param.time_stamp = param.time_stamp || Math.floor(Date.now()/1000);
	param.nonce_str = param.nonce_str || util.generateNonceString();
	var param = util.mix({}, this.wxpayOptions, param);
	param.sign = this.sign(param);

	var query = Object.keys(param).filter(function(key){
		return ['sign', 'mch_id', 'product_id', 'appid', 'time_stamp', 'nonce_str'].indexOf(key)>=0;
	}).map(function(key){
		return key + "=" + encodeURIComponent(param[key]);
	}).join('&');

	return "weixin://wxpay/bizpayurl?" + query;
});

WXPay.mix('useWXCallback', function(fn){
	return function(req, res, next){
		var _this = this;
		util.pipe(req, function(err, data){
			var xml = data.toString('utf8');
			util.parseXML(xml, function(err, msg){
				req.wxmessage = msg;
				fn.apply(_this, [msg, req, res, next]);
			});
		});
	};
});
