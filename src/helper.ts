const crypto = require('crypto')
const _json2xml = require('json2xml')
const _xml2json = require('xml2json')

export const md5 = (str) => {
	const hash = crypto.createHash('md5')
	return hash.update(str).digest('hex')
}

export const nonce = (length = 32) => {
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var maxPos = chars.length
	var nonceStr = ""
	for (var i = 0; i < length; i++) {
		nonceStr += chars.charAt(Math.floor(Math.random() * maxPos))
	}
	return nonceStr
}

export const json2xml = (json) => _json2xml({ xml: json }, { header: true })

export const xml2json = (xml) => {
	const text = _xml2json.toJson(xml)
	const json = JSON.parse(text)
	return json.xml
}
