let Joi = require('joi')

const email = Joi.string().required()
const user = Joi.string().required()
const pswd = Joi.string().required()


const userCreateSchema = {
    email,
    user,
    pswd
}

module.exports = {
    userCreateSchema
}

