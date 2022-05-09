const { ReadOnlyBaseModel } = require('./base')

class Country extends ReadOnlyBaseModel {
  static tableName = 'country'
}

module.exports = Country
