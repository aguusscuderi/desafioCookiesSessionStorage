require('dotenv').config()
let mongoose = require('mongoose')
const MONGO_DB = process.env.MONGO_DB_URI
const DB_NAME = process.env.DB_NAME



const db_connection = async () => {
 try {
    console.log(`created: ${MONGO_DB}${DB_NAME}`)
    await mongoose.connect(`${MONGO_DB}${DB_NAME}`)
 } catch (error) {
     console.log(error)
 }
}

module.exports = db_connection