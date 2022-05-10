const joi = require('joi')
const boom = require('@hapi/boom')
const s3 = require('../../../lib/s3')
const { scopes } = require('../../../models/roles')
const config = require('../../../config')
const { bucketName, bucketPrefix } = config

module.exports = {
  method: 'post',
  path: '/dam/sign',
  handler: async (request, h) => {
    try {
      const { query, payload } = request
      const { prefix } = query
      const { files } = payload

      const promises = files.map(async file => {
        const { name } = file
        // const existing = existingMediaMap[name.toLowerCase()]
        const type = file.type
        // const fileSplitter = file.name.split('.')
        // const fileExtention = fileSplitter[fileSplitter.length - 1]
        const key = `${bucketPrefix}${prefix}/${name}`

        // let result
        // if (existing) {
        //   existing.size = file.size
        //   result = await db.Media
        //     .query()
        //     .updateAndFetchById(existing.id, existing)
        // } else {
        //   const media = Object.assign({
        //     tenantId,
        //     projectId,
        //     scenarioId,
        //     key
        //   }, file)

        //   result = await db.Media
        //     .query()
        //     .insertAndFetch(media)
        // }

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
      query: joi.object().keys({
        prefix: joi.string().uri({ relativeOnly: true }).required()
      }).required(),
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
