const joi = require('joi')
const api = require('../../../lib/api')
const { scopes } = require('../../../models/roles')
const { Errors } = require('../../../models/view/base')
const { EditViewModel, schema } = require('../../../models/view/admin/group/form')

module.exports = [
  {
    method: 'GET',
    path: '/group/{id}/edit',
    handler: async (request, h) => {
      const { params } = request
      const { id } = params
      const group = await api.group.get(id)

      return h.view('admin/group/form', new EditViewModel(group))
    },
    options: {
      auth: {
        access: {
          scope: scopes.group.manage
        }
      },
      validate: {
        params: joi.object().keys({
          id: joi.string().guid().required()
        }).required()
      }
    }
  },
  {
    method: 'POST',
    path: '/group/{id}/edit',
    handler: async (request, h) => {
      const { params, payload } = request
      const { id } = params
      const group = await api.group.update(id, payload)

      return h.redirect(`/group/${group.id}`)
    },
    options: {
      validate: {
        payload: schema,
        params: joi.object().keys({
          id: joi.string().guid().required()
        }).required(),
        failAction: async (request, h, err) => {
          const { payload } = request
          const errors = Errors.fromJoi(err)
          const model = new EditViewModel(payload, errors)

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
