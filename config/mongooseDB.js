let {Schema, model} = require('mongoose')
let {userCreateSchema} = require('../components/userSchema/userSchema')
const userSchema = new Schema(userCreateSchema)
const userModel = model('user', userSchema)

module.exports = userModel