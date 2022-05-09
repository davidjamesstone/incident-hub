const routes = [].concat(
  require('../routes/admin/event/create'),
  require('../routes/admin/dam/create'),
  require('../routes/admin/dam/sign')
)

module.exports = {
  plugin: {
    name: 'admin-router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
