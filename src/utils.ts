import crypto from 'crypto'

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
