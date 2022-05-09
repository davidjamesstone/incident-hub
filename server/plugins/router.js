const routes = [].concat(
  require('../routes/home'),
  require('../routes/event'),
  require('../routes/group'),
  require('../routes/about'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
