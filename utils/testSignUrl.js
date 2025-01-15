const signUrl = require('./signUrl')

const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=Calle+Paseo+de+las+Delicias+116&key=AIzaSyBc8CxEYh7F0l2r5jP3KVdDhRp3zFYReh4'
const secret = 'z0UcItlSgiYI3WPdeheB5ildPl0='

const signedUrl = `${url}&signature=${signUrl(url, secret)}`
console.log(signedUrl)