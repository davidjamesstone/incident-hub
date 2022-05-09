const joi = require('joi')
const api = require('../lib/api')
const date = require('../lib/date')
const { DATE_FORMAT } = require('../../constants')

module.exports = [
  {
    method: 'GET',
    path: '/event/{id}',
    handler: async (request, h) => {
      const { id } = request.params
      const event = await api.events.get(id)

      return h.view('event', { event })
    },
    options: {
      validate: {
        params: joi.object().keys({
          id: joi.string().guid().required()
        }).required()
      }
    }
  }
]
