const { v4: uuid } = require('uuid')
const { Errors } = require('../../../models/form')
const { ViewModel, schema } = require('../../../models/admin/event/create')
const { updateEvent } = require('../../../lib/db')

module.exports = [
  {
    method: 'GET',
    path: '/event/create',
    handler: (request, h) => {
      return h.view('admin/event/create', new ViewModel())
    }
  },
  {
    method: 'POST',
    path: '/event/create',
    handler: async (request, h) => {
      await updateEvent(uuid(), request.payload)

      return h.view('admin/event/create', new ViewModel())
    },
    options: {
      validate: {
        payload: schema,
        failAction: async (request, h, err) => {
          const { payload } = request
          const errors = Errors.fromJoi(err)
          const model = new ViewModel(payload, errors)

          return h.view('admin/event/create', model).takeover()
        }
      }
    }
  }
]
