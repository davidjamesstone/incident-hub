const joi = require('joi')
const envs = ['dev', 'test', 'prod']

// Define config schema
const schema = joi.object().keys({
  port: joi.number().default(3000),
  env: joi.string().valid(...envs).default(envs[0]),
  eventTableName: joi.string().required()
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  eventTableName: process.env.EVENT_TABLE_NAME
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

// Add some helper props
value.isDev = value.env === 'dev'

module.exports = value
