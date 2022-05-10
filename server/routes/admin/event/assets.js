const joi = require('joi')
const boom = require('@hapi/boom')
const s3 = require('../../../lib/s3')
const api = require('../../../lib/api')
const config = require('../../../config')
const { scopes } = require('../../../models/roles')
const { bucketName, bucketPrefix } = config
const { filesize } = require('../../../lib/helpers')

module.exports = [
  {
    method: 'GET',
    path: '/event/{id}',
    handler: async (request, h) => {
      return h.view('admin/dam/index')
    },
    options: {
      auth: {
        access: {
          scope: scopes.assets.manage
        }
      },
      validate: {
        query: joi.object().keys({
          prefix: joi.string().uri({ relativeOnly: true }).required()
        }).required()
      }
    }
  },
  {
    method: 'GET',
    path: '/event/{id}/assets',
    handler: async (request, h) => {
      const { params } = request
      const { id: eventId } = params
      const event = await api.events.get(eventId)
      const assets = await api.assets.find(eventId)
      const rows = assets.map(asset => ({
        key: { html: getLink(asset) },
        value: { text: filesize(asset.size) },
        actions: {
          items: [
            {
              href: '#',
              text: 'View'
            }
          ]
        }
      }))

      const tableRows = assets.map(asset => ([
        {
          html: getLink(asset)
        },
        {
          text: filesize(asset.size)
        },
        {
          html: '<a href="#">View</a>',
          classes: 'govuk-!-text-align-right'
        }
      ]))

      return h.view('admin/event/assets', { tableRows, rows, event, assets })
    },
    options: {
      auth: {
        access: {
          scope: scopes.assets.manage
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
    path: '/event/{id}/assets',
    handler: async (request, h) => {
      try {
        const { params, payload } = request
        const { id } = params
        const { files } = payload

        const promises = files.map(async file => {
          const { name } = file
          const type = file.type
          const key = `${bucketPrefix}/event/${id}/${name}`

          // Build policy signature
          const sign = {
            Bucket: bucketName,
            Expires: 60 * 60, // 1 hr (in secs)
            Fields: {
              key,
              acl: 'private',
              'content-type': type
            },
            conditions: [
              { bucket: bucketName },
              { key },
              ['starts-with', '$content-type', `${type}/`],
              { acl: 'private' },
              ['content-length-range', 100, 20000000], // 100Byte - 20MB
              { success_action_status: 201 }
            ]
          }

          const policy = s3.createPresignedPost(sign)

          return { policy, file }
        })

        const results = await Promise.all(promises)

        return results
      } catch (err) {
        return boom.badRequest(err, err.message)
      }
    },
    options: {
      auth: {
        access: {
          scope: scopes.assets.manage
        }
      },
      validate: {
        payload: joi.object().keys({
          files: joi.array().items(joi.object().keys({
            name: joi.string().required(),
            size: joi.number().integer().required(),
            type: joi.string().allow('image').allow('video').required()
          }))
        })
      }
    }
  }
]

function getLink (asset) {
  // return asset.filename
  return `<div class="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
  <div class="govuk-checkboxes__item">
    <input class="govuk-checkboxes__input" id="x" type="checkbox" value="${asset.filename}">
    <label class="govuk-label govuk-checkboxes__label" for="x">
    ${asset.filename}
    </label>
  </div>`
}
