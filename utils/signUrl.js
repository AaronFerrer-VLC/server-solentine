const crypto = require('crypto')

function signUrl(url, secret) {
    const urlObj = new URL(url)
    const baseString = urlObj.pathname + urlObj.search
    const decodedSecret = Buffer.from(secret, 'base64')
    const signature = crypto.createHmac('sha1', decodedSecret).update(baseString).digest('base64')
    return signature.replace(/\+/g, '-').replace(/\//g, '_')
}
module.exports = signUrl