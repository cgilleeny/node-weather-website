const path = require('path')
const express = require('express')
const hbs = require('hbs')
const getForecast = require('./utils/darksky')
const geocode = require('./utils/geocode')

const app = express()

// defines paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlevars engine & views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Bob Builder'
    })
})


app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helptext: 'Select a location and get the current weather conditions',
        name: 'Bob Builder'
    })
})


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Bob Builder'
    })
})

app.get('/products', (req, res) => {
    if (!req.query.key) {
        return res.send({
            error: 'You must provide a key term'
        })
    }
    console.log(req.query.key)
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address && (!req.query.latitude || !req.query.longitude)) {
        return res.send({
            error: 'You must provide an address or lat & long'
        })
    }
    if (req.query.address) {
        geocode(req.query.address, (error, {latitude, longitude, place} = {}) => {
            if (error) {
               return res.send({
                    error: error
                })
            }
    
            getForecast(latitude, longitude, (error, data) => {
                if (error) {
                    return res.send({
                         error: error
                     })
                }
                res.send({
                    forecast: data,
                    location: place,
                    address: req.query.address,
                })
            })
        })
    } else {
        getForecast(req.query.latitude, req.query.longitude, (error, data) => {
            if (error) {
                return res.send({
                     error: error
                 })
            }
            res.send({
                forecast: data,
                latitude: req.query.latitude,
                longitude: req.query.longitude
            })
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'Bob Builder',
        text: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        name: 'Bob Builder',
        text: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})