const joi = require('joi')
const api = require('../../../lib/api')
const date = require('../../../lib/date')
const { scopes } = require('../../../models/roles')
const { Errors } = require('../../../models/view/base')
const { EditViewModel, schema } = require('../../../models/view/admin/event/form')

module.exports = [
  {
    method: 'GET',
    path: '/event/{id}/edit',
    handler: async (request, h) => {
      const { params } = request
      const { id } = params
      const event = await api.event.get(id)
      const groups = await api.group.find()
      event.themes = event.themes.map(theme => theme.id)
      event.date = date(event.date).format('YYYY-MM-DDTHH:mm')

      return h.view('admin/event/form', new EditViewModel(event, undefined, groups))
    },
    options: {
      auth: {
        access: {
          scope: scopes.event.manage
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
    path: '/event/{id}/edit',
    handler: async (request, h) => {
      const { params, payload } = request

      // Map multiselected themes to objects
      if (Array.isArray(payload.themes)) {
        payload.themes = payload.themes.map(id => ({ id }))
      }

      const { id } = params
      const event = await api.event.update(id, payload)

      return h.redirect(`/event/${event.id}`)
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
          const model = new EditViewModel(payload, errors, groups)

          return h.view('admin/event/create', model).takeover()
        }
      }
    }
  }
]
