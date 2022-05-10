const routes = [].concat(
  require('../routes/admin/event/create'),
  require('../routes/admin/event/assets'),
  require('../routes/admin/dam'),
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
