
var WXPay = require('./lib/wxpay');

WXPay.mix('Util', require('./lib/util'));

module.exports = WXPay;