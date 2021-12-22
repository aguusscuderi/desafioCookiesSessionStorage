let Joi = require('joi')

const email = Joi.string().required()
const name = Joi.string().required()
const surname = Joi.string().required()
const edad = Joi.string().required()
const alias = Joi.string()
const message = Joi.string().required()
const date = Joi.date()
const id = Joi.number()

const msgCreateSchema = {
    author: {
        name, 
        email,
        surname,
        edad,
        alias
    },
    message,
    date,
    id
}

module.exports = {
    msgCreateSchema
}

