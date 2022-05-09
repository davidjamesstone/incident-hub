const { BaseModel } = require('./base')
const Group = require('./group')
const Country = require('./country')
const Region = require('./region')
const Theme = require('./theme')

class Event extends BaseModel {
  static tableName = 'event'

  static relationMappings = {
    group: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Group,
      join: {
        from: 'event.groupId',
        to: 'group.id'
      }
    },

    country: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Country,
      join: {
        from: 'event.countryId',
        to: 'country.id'
      }
    },

    region: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Region,
      join: {
        from: 'event.regionId',
        to: 'region.id'
      }
    },

    themes: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: Theme,
      join: {
        from: 'event.id',
        through: {
          from: 'eventTheme.eventId',
          to: 'eventTheme.themeId'
        },
        to: 'theme.id'
      }
    }
  }
}

module.exports = Event
