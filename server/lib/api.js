const impl = require('./impl')

const api = {
  event: {
    create: impl.event.create,
    update: impl.event.update,
    find: impl.event.find,
    get: impl.event.get
  },
  group: {
    create: impl.group.create,
    update: impl.group.update,
    get: impl.group.get,
    find: impl.group.find,
    getEvents: impl.group.getEvents
  },
  asset: {
    find: impl.asset.find
  }
}

module.exports = api
