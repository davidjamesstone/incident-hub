const { ReadOnlyBaseModel } = require('./base')

class Theme extends ReadOnlyBaseModel {
  static tableName = 'theme'
}

module.exports = Theme
