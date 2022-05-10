const impl = require('./impl')

const api = {
  events: {
    create: impl.events.create,
    find: impl.events.find,
    get: impl.events.get
  },
  group: {
    get: impl.group.get,
    find: impl.group.find,
    getEvents: impl.group.getEvents
  },
  assets: {
    find: impl.assets.find
  }
}

module.exports = api
