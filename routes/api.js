let express = require('express') //require express
let db = require('../models') //require models directory
let Student = db.Student

let router = express.Router() // Make a router to match requests to functions

router.get('/students', function(req, res, next){
    Student.findAll( {order: ['present','starID']} ).then( students => { //Sort by non-present first and then by starID
        return res.json(students)
    }).catch( err => next(err) )
})

//called when new student is added
router.post('/students', function(req, res, next){
    Student.create( req.body ).then( data => { //contains any json the vue client sends in the request
        return res.status(201).send('ok')
    }).catch( err => {
        //Handle user errors, like missing starID or name
        if ( err instanceof db.Sequelize.ValidationError) {
            //Respond with 400 bad request error code, include error messages
            let messages = err.errors.map( e => e.message)
            return res.status(400).json(messages)
        }

        //Otherwise, something else has gone wrong, most likely a server error
        return next(err)
    })
})

//edit a student
router.patch('/students/:id', function(req, res, next){
    //Sets studentID to what was requested in the url
    let studentID = req.params.id
    let updatedStudent = req.body
    Student.update( updatedStudent, { where: { id: studentID} } )
        .then( (rowsModified) => {

            let numberOfRowsModified = rowsModified[0] //Number of rows changed

            if (numberOfRowsModified == 1) { //If one row is changed, all good
                return res.send('ok')
            }

            else { //Student not found if now rows
                return res.status(404).json(['Student with that ID not found'])
            }
        })
        .catch( err => {
            //If it's a validation user, tell them it's a bad request, thing slike modifying things to have no name
            if (err instanceof db.Sequelize.ValidationError) {
                let messages = err.errors.map( e => e.message)
                return res.status(400).json(messages)
            } else {
                //unexpected error
                return next(err)
            }
        })
})

//delete a student
router.delete('/students/:id', function(req, res, next){
    let studentID = req.params.id
    Student.destroy( {where: { id: studentID } } )
        .then( (rowsDeleted) => {
            if (rowsDeleted == 1){
                return res.send('ok')
            } else {
                return res.status(404).json(['Not found'])
            }
            
        })
        .catch( err => next(err) ) // For unexpected errors
})


module.exports = router