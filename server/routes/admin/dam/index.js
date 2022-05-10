const joi = require('joi')
const { scopes } = require('../../../models/roles')

module.exports = [
  {
    method: 'GET',
    path: '/dam',
    handler: async (request, h) => {
      return h.view('admin/dam/index')
    },
    options: {
      auth: {
        access: {
          scope: scopes.assets.manage
        }
      },
      validate: {
        query: joi.object().keys({
          prefix: joi.string().uri({ relativeOnly: true }).required()
        }).required()
      }
    }
  }
]
