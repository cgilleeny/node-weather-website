const request = require('request')

const geocodeingToken = 'pk.eyJ1IjoiY2dpbGxlZW55IiwiYSI6ImNqdDRzbnk1ZjE4azA0OXBoMzJ5dHFoOXcifQ.BJeLQmH134U9wn_lr9pwjg'

const geocode = (addressString, callback) => {
    const mapboxURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURI(addressString) + '.json?access_token=' + geocodeingToken
    console.log(mapboxURL)
    request({ url: mapboxURL, json: true }, (error, { body }) => {
        if (error) {
            return callback('Unable to connect to geocode service!')
        }
        if (body.features.length === 0) {
            return callback('Unable to geocode address: features not found')
        }

        const coordinates = body.features[0].center
        if (coordinates.length === 0) {
            return callback('Unable to geocode address: center not found')
        }
        callback(undefined, { 
                latitude: coordinates[1],
                longitude: coordinates[0],
                place: body.features[0].place_name})
    })
}


module.exports = geocode