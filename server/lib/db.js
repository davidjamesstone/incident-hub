
const AWS = require('aws-sdk')
const config = require('../config')
const { removeKeys } = require('./helpers')
const ddb = new AWS.DynamoDB.DocumentClient()
const tableName = config.eventTableName

function formatEvent (contact) {
  const keysToRemove = ['pk', 'sk']
  contact.id = contact.pk
  return removeKeys(contact, keysToRemove)
}

/**
 * Update a ddb record
 *
 * @param {string} pk - The partition key
 * @param {string} sk - The sort key
 * @param {object} data - The patch data
 */
async function update (pk, sk, data) {
  const attrs = Object.keys(data)

  const params = {
    TableName: tableName,
    Key: { pk, sk },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: '',
    ReturnValues: 'ALL_NEW'
  }

  attrs.forEach((attr, index) => {
    const prefix = (!index ? 'set' : ',')
    params.UpdateExpression += prefix + ' #' + attr + ' = :' + attr
    params.ExpressionAttributeValues[':' + attr] = data[attr]
    params.ExpressionAttributeNames['#' + attr] = attr
  })

  const result = await ddb.update(params).promise()

  return result.Attributes
}

/**
 * Get an event by id
 *
 * @param {string} id - The event id
 */
async function getEventById (id) {
  const result = await ddb.get({
    TableName: tableName,
    Key: {
      pk: id,
      sk: 'E'
    }
  }).promise()

  return formatEvent(result.Item)
}

/**
 * Update an event by id
 *
 * @param {string} email - The event id
 */
async function updateEvent (id, data) {
  const contact = await update(id, 'E', data)
  return formatEvent(contact)
}

module.exports = {
  updateEvent,
  getEventById
}
