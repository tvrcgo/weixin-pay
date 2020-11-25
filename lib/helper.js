const crypto = require('crypto')
const json2xml = require('json2xml')
const xml2json = require('xml2json')

exports.md5 = (str) => {
	const hash = crypto.createHash('md5')
	return hash.update(str).digest('hex')
}

exports.nonce = (length = 32) => {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var maxPos = chars.length
	var nonceStr = ""
	for (var i = 0; i < length; i++) {
		nonceStr += chars.charAt(Math.floor(Math.random() * maxPos))
	}
	return nonceStr
}

exports.json2xml = (json) => json2xml({ xml: json }, { header: true })

exports.xml2json = (xml) => {
	const text = xml2json.toJson(xml)
	const json = JSON.parse(text)
	return json.xml
}
