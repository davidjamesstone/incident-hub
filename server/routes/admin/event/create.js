const joi = require('joi')
const api = require('../../../lib/api')
const { scopes } = require('../../../models/roles')
const { Errors } = require('../../../models/view/base')
const { CreateViewModel, schema } = require('../../../models/view/admin/event/form')

module.exports = [
  {
    method: 'GET',
    path: '/event/create',
    handler: async (request, h) => {
      const { groupId } = request.query
      const groups = await api.group.find()
      const data = { groupId }

      return h.view('admin/event/form', new CreateViewModel(data, undefined, groups))
    },
    options: {
      auth: {
        access: {
          scope: scopes.event.manage
        }
      },
      validate: {
        query: joi.object().keys({
          groupId: joi.string().guid()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/event/create',
    handler: async (request, h) => {
      const payload = request.payload

      // Map multiselected themes to objects
      if (Array.isArray(payload.themes)) {
        payload.themes = payload.themes.map(id => ({ id }))
      }

      const event = await api.event.create(payload)

      return h.redirect(`/admin/event/${event.id}/assets`)
    },
    options: {
      auth: {
        access: {
          scope: scopes.event.manage
        }
      },
      validate: {
        payload: schema,
        failAction: async (request, h, err) => {
          const { payload } = request
          const errors = Errors.fromJoi(err)
          const groups = await api.group.find()
          const model = new CreateViewModel(payload, errors, groups)

          return h.view('admin/event/form', model).takeover()
        }
      }
    }
  }
]
