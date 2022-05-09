const boom = require('@hapi/boom')
const { roles } = require('../models/roles')

module.exports = {
  plugin: {
    name: 'auth',
    register: (server, options) => {
      const scheme = function (server, options) {
        return {
          authenticate: function (request, h) {
            // const req = request.raw.req
            // const authorization = req.headers.authorization
            // if (!authorization) {
            //   throw Boom.unauthorized(null, 'Custom')
            // }

            const credentials = {
              id: '8b3a3a66-c827-45ba-b1f2-45d93a6d3ebf',
              firstName: 'John',
              lastName: 'Smith',
              scope: roles.admin,
              isAdmin: true
            }

            return h.authenticated({ credentials })
            // return h.unauthenticated(boom.unauthorized('No credentials'))
          }
        }
      }

      server.auth.scheme('cola-schema', scheme)
      server.auth.strategy('cola-strategy', 'cola-schema')
      server.auth.default('cola-strategy')
    }
  }
}
