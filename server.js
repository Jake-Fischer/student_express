//This is the code for our server.

//Require express
let express = require('express')

//get the routes for the api
let api_routes = require('./routes/api.js')

let path = require('path')

//Create an express app
let app = express()

let vueClientPath = path.join(__dirname, 'student-sign-in-client', 'dist')

app.use(express.static(vueClientPath))

//enable express app to understand json, and convert to JavaScript
app.use(express.json())

app.use('/api', api_routes)

app.use(function(req, res, next) {
    // Respond with 404 to any other requests
    res.status(404).send('Not found')
})

app.use(function(err, req, res, next){
    // Respond with 500 for problems with server
    console.error(err.stack)
    res.status(500).send('Server error')
})

//Create the server to run the express app 
let server = app.listen(process.env.PORT || 3000, function(){ //Tell the server which port to run on
    console.log('Express server running on port ', server.address().port) //What the server does
})