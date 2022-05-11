const joi = require('joi')
const api = require('../lib/api')

module.exports = [
  {
    method: 'GET',
    path: '/event/{id}',
    handler: async (request, h) => {
      const { id } = request.params
      const event = await api.event.get(id)

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
