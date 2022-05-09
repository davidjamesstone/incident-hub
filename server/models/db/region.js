const { ReadOnlyBaseModel } = require('./base')

class Region extends ReadOnlyBaseModel {
  static tableName = 'region'
}

module.exports = Region
