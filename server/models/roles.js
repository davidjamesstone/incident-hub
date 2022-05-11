const scopes = {
  event: {
    manage: 'events:manage'
  },
  group: {
    manage: 'groups:manage'
  },
  asset: {
    manage: 'assets:manage'
  }
}

const { event, group, asset } = scopes

const roles = {
  admin: [
    ...Object.values(event),
    ...Object.values(group),
    ...Object.values(asset)
  ]
}

module.exports = {
  scopes,
  roles
}
