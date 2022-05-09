const { Model } = require('objection')
const Knex = require('knex')
const knexfile = require('../../../knexfile')
const { INCIDENT_HUB_SCHEMA_NAME } = require('../../../constants')
const knex = Knex(knexfile)

Model.knex(knex)

// https://vincit.github.io/objection.js/guide/relations.html#examples
class BaseModel extends Model {
  static query () {
    // https://github.com/Vincit/objection.js/issues/85#issuecomment-185183032
    return super.query().withSchema(INCIDENT_HUB_SCHEMA_NAME)
  }

  // https://vincit.github.io/objection.js/recipes/timestamps.html
  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }
}

class ReadOnlyBaseModel extends BaseModel {
  $beforeUpdate () {
    throw new Error('Model is read only')
  }

  $beforeInsert () {
    throw new Error('Model is read only')
  }

  $beforeDelete () {
    throw new Error('Model is read only')
  }
}

module.exports = {
  BaseModel,
  ReadOnlyBaseModel
}
