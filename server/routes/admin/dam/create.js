const { Errors } = require('../../../models/view/form')
const { ViewModel, schema } = require('../../../models/view/admin/event/create')
const api = require('../../../lib/api')
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
      }
    }
  }
]
