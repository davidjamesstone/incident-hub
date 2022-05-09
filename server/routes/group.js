const joi = require('joi')
const api = require('../lib/api')
const date = require('../lib/date')
const { DATE_FORMAT } = require('../../constants')

module.exports = [
  {
    method: 'GET',
    path: '/group/{id}',
    handler: async (request, h) => {
      const { id } = request.params
      const group = await api.group.get(id)
      const events = await api.group.getEvents(id)

      return h.view('group', { group, events })
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
