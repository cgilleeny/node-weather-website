const request = require('request')

const darkskyToken = '917a20392a20eb18c26fdbc57640620b'

const getForecast = (latitude, longitude, callback) => {
    const darkskyURL = 'https://api.darksky.net/forecast/' + darkskyToken + '/' + latitude + ',' + longitude
    console.log(darkskyURL)
    request({ url: darkskyURL, json: true }, (error, { body }) => {
        debugger
        if (error) {
            return callback('Unable to connect to weather service!')
            //return
        }
        if (body.error) {
            return callback('Invalid latitude or longitude!')
            //return
        }
        callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees F.')
    })
}


module.exports = getForecast
