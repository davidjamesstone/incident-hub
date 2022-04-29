const routes = [].concat(
  require('../routes/admin/event/create')
)

module.exports = {
  plugin: {
    name: 'admin-router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
