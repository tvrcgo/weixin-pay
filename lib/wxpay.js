
var util = require('./util');
var request = require('request');
var md5 = require('MD5');

var mix = util.mix;

exports = module.exports = WXPay;

function WXPay(payopts) {
	
	if (!(this instanceof WXPay)) {
		return new WXPay(payopts);
	};
	
	mix(this, {

		_payopts: payopts,

		createUnifiedOrder: function(order, fn){

			var opts = mix({}, this._payopts, order);

			opts.nonce_str = opts.nonce_str || util.generateNonceString();
			opts.sign = sign(opts);
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
		}
	});

	var sign = function(param){

		var querystring = Object.keys(param).filter(function(key){
			return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key)<0;
		}).sort().map(function(key){
			return key + '=' + param[key];
		}).join("&") + "&key=" + param.partner_key;

		return md5(querystring).toUpperCase();
	};
}