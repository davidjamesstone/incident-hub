const routes = [].concat(
  require('../routes/admin/group/create'),
  require('../routes/admin/group/edit'),
  require('../routes/admin/event/create'),
  require('../routes/admin/event/edit'),
  require('../routes/admin/event/assets')
)

module.exports = {
  plugin: {
    name: 'admin-router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
