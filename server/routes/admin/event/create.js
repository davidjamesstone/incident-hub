const { Errors } = require('../../../models/view/form')
const { ViewModel, schema } = require('../../../models/view/admin/event/create')
const api = require('../../../lib/api')
const { scopes } = require('../../../models/roles')

module.exports = [
  {
    method: 'GET',
    path: '/event/create',
    handler: async (request, h) => {
      const groups = await api.group.find()
      const data = { title: 'a', description: 's', date: '2022-05-14T23:02', countryId: 'c6acb58c-bd92-4481-a210-72c02ca4db3c', regionId: 'fee5a1f1-d889-4ac7-b8d2-ef6163790cca', source: 'multiple', sourceClassification: 'opensource', caveats: '', impactRating: 'low', themes: ['6d5e02e8-32ec-4e56-a4ad-9697d936f927', 'c3484143-c6b6-4c01-81d3-fc6224101899'] }
      return h.view('admin/event/create', new ViewModel(data, undefined, { groups }))
    },
    options: {
      auth: {
        access: {
          scope: scopes.events.manage
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/event/create',
    handler: async (request, h) => {
      try {
        const payload = request.payload

        if (Array.isArray(payload.themes)) {
          payload.themes = payload.themes.map(id => ({ id }))
        }

        const event = await api.events.create(payload)
        console.log(event)
      } catch (err) {
        console.error(err)
      }

      const groups = await api.group.find()
      return h.view('admin/event/create', new ViewModel(undefined, undefined, { groups }))
    },
    options: {
      validate: {
        payload: schema,
        failAction: async (request, h, err) => {
          const { payload } = request
          const errors = Errors.fromJoi(err)
          const groups = await api.group.find()
          const model = new ViewModel(payload, errors, { groups })

          return h.view('admin/event/create', model).takeover()
        }
      }
    }
  }
]
