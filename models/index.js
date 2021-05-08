let { Sequelize, DataTypes } = require('sequelize')

let env = process.env.NODE_ENB || 'development' 
//Look for environment variables and set them as env if there are none, use the development env
//If this is running locally, develpoment should be the env variable, if it's running on heroku there ill be a process

let config = require(__dirname + '/../config.json')[env]

let db = {}

let sequelize

if (config.use_env_variable) {
    //At heroku, use postgress
    sequelize = new Sequelize(process.env[config.use_env_variable], config) //New sequalize object using the env
} else {
    //When running locally, use SQLite
    sequelize = new Sequelize(config)
}

let studentModel = require('./student')(sequelize, DataTypes)

db[studentModel.name] = studentModel

db.sequelize = sequelize //info on how to connect to the database
db.Sequelize = Sequelize // reference to sequelize library

module.exports = db //export the db