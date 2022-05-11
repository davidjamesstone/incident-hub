const api = require('../../../lib/api')
const { scopes } = require('../../../models/roles')
const { Errors } = require('../../../models/view/base')
const { CreateViewModel, schema } = require('../../../models/view/admin/group/form')

module.exports = [
  {
    method: 'GET',
    path: '/group/create',
    handler: async (request, h) => {
      return h.view('admin/group/form', new CreateViewModel())
    },
    options: {
      auth: {
        access: {
          scope: scopes.group.manage
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/group/create',
    handler: async (request, h) => {
      const payload = request.payload
      const group = await api.group.create(payload)

      return h.redirect(`/group/${group.id}`)
    },
    options: {
      validate: {
        payload: schema,
        failAction: async (request, h, err) => {
          const { payload } = request
          const errors = Errors.fromJoi(err)
          const model = new CreateViewModel(payload, errors)

          return h.view('admin/group/form', model).takeover()
        }
      },
      auth: {
        access: {
          scope: scopes.group.manage
        }
      }
    }
  }
]
