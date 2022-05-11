const { scopes } = require('../models/roles')
const config = require('../config')

/*
* Adds an `onPreResponse` listener to apply
* some common props to the view context
*/

module.exports = {
  plugin: {
    name: 'views-context',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.variety === 'view') {
          const ctx = response.source.context || {}

          // Set the auth object
          // onto the top level context
          const { auth } = request

          ctx.auth = auth
          ctx.scopes = scopes
          ctx.s3BucketUrl = config.s3BucketUrl

          const navigation = []

          if (auth.isAuthenticated) {
            const creds = auth.credentials
            ctx.user = creds.user
            ctx.credentials = creds

            navigation.push({
              href: '/',
              text: 'Live reporting'
            })

            navigation.push({
              href: '/group',
              text: 'Groups'
            })

            if (creds.scope.includes(scopes.event.manage)) {
              navigation.push({
                href: '/admin/event/create',
                text: 'New event'
              })
            }

            if (creds.scope.includes(scopes.group.manage)) {
              navigation.push({
                href: '/admin/group/create',
                text: 'New group'
              })
            }

            navigation.push(
              {
                href: '/account',
                text: 'Account',
                active: request.path === '/account'
              }
            )

            navigation.push({
              href: '/logout',
              text: 'Sign out'
            })
          } else {
            navigation.push({
              href: '/login',
              text: 'Sign in'
            })
          }

          ctx.navigation = navigation

          response.source.context = ctx
        }

        return h.continue
      })
    }
  }
}
