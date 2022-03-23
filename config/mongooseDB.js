let {Schema, model} = require('mongoose')
let {userCreateSchema} = require('../components/userSchema/userSchema')
const userSchema = new Schema(userCreateSchema)
const UserModel = model('user', userSchema)

module.exports = UserModel