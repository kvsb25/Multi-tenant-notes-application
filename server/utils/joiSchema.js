const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')),
    password: Joi.string().required(),
    tenant: Joi.string().optional(),
    role: Joi.string().valid(...['admin', 'member']).optional()
})

const noteCreateSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string()
})

const noteUpdateSchema = Joi.object({
    title: Joi.string().optional(),
    content: Joi.string().optional(),
})

module.exports = {
    loginSchema,
    noteCreateSchema,
    noteUpdateSchema
}