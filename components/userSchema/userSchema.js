let Joi = require('joi')

const username = Joi.string().required()
const pswd = Joi.string().required()


const userCreateSchema = {
    username,
    pswd
}

module.exports = {
    userCreateSchema
}

