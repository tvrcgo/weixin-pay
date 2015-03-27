
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
})