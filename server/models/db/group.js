const { BaseModel } = require('./base')

class Group extends BaseModel {
  static tableName = 'group'

  static get relationMappings () {
    // https://vincit.github.io/objection.js/guide/relations.html#require-loops
    const Event = require('./event')

    return {
      events: {
        relation: BaseModel.HasManyRelation,
        modelClass: Event,
        join: {
          from: 'group.id',
          to: 'event.groupId'
        }
      }
    }
  }
}

module.exports = Group
