let {Schema, model} = require('mongoose')
let {msgCreateSchema} = require('../components/messages-schema/msgSchema')
const msgSchema = new Schema(msgCreateSchema)
const msgModel = model('messages', msgSchema)

module.exports = msgModel