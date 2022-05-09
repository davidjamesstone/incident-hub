const path = require('path')
const nunjucks = require('nunjucks')
const config = require('../config')
const pkg = require('../../package.json')
const { date, fromNow } = require('../lib/filters')

const analyticsAccount = config.analyticsAccount

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)

          return (context) => {
            return template.render(context)
          }
        },
        prepare: (options, next) => {
          const env = options.compileOptions.environment = nunjucks.configure([
            path.join(options.relativeTo || process.cwd(), options.path),
            'node_modules/govuk-frontend/'
          ], {
            autoescape: true,
            watch: false
          })

          // Register globals/filters
          env.addFilter('date', date)
          env.addFilter('fromnow', fromNow)

          return next()
        }
      }
    },
    path: '../views',
    relativeTo: __dirname,
    isCached: !config.isDev,
    context: {
      appVersion: pkg.version,
      assetPath: '/assets',
      serviceName: 'Incident Hub',
      pageTitle: 'Incident Hub - GOV.UK',
      analyticsAccount
    }
  }
}
