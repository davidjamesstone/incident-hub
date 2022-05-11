const api = require('../lib/api')
const date = require('../lib/date')
const { DATE_FORMAT } = require('../../constants')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      const data = await api.event.find()
      const head = [
        { text: 'Title' }, { text: 'Linked to' },
        { text: 'Author' }, { text: 'Date' }
      ]
      const rows = data.map(item => {
        const { id, title, group, createdAt, createdBy = 'John Smith' } = item

        return [
          { html: `<a href="/event/${id}" class="govuk-link--no-visited-state">${title}</a>` },
          { html: group ? `<a href="/group/${group.id}" class="govuk-link--no-visited-state">${group.name}</a>` : '<span>None</span>' },
          { text: createdBy },
          { text: date(createdAt).format(DATE_FORMAT) }
        ]
      })

      return h.view('home', { rows, head })
    }
  }
]
