const joi = require('joi')
const api = require('../lib/api')
const date = require('../lib/date')
const { DATE_FORMAT } = require('../../constants')

module.exports = [
  {
    method: 'GET',
    path: '/group',
    handler: async (request, h) => {
      const groups = await api.group.find()
      const head = [
        { text: '' }, { text: 'Description' }, { text: 'Last event' },
        { text: 'Summary' }, { text: 'Date' }, { text: 'Author' }
      ]

      const rows = groups.map(group => {
        const { id, name, description, summary, createdAt, createdBy = 'John Smith', lastEventCreatedAt } = group

        return [
          { html: `<a href="/group/${id}" class="govuk-link--no-visited-state">${name}</a>` },
          { text: description },
          { text: date(lastEventCreatedAt).format(DATE_FORMAT) },
          { text: summary },
          { text: createdBy },
          { text: date(createdAt).format(DATE_FORMAT) }
        ]
      })
      return h.view('groups', { head, rows, groups })
    }
  },
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
