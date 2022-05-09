const hapi = require('@hapi/hapi')
const config = require('./config')
const data = require('./data')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    host: config.host,
    routes: {
      auth: {
        mode: 'required'
      },
      security: true,
      validate: {
        options: {
          abortEarly: false,
          stripUnknown: true,
          errors: {
            wrap: {
              label: false,
              array: false
            }
          }
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await data.loadStaticData()

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/views-context'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/admin-router'), {
    routes: {
      prefix: '/admin'
    }
  })
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/logging'))
  await server.register(require('blipp'))

  return server
}

module.exports = createServer
