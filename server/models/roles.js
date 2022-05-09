const scopes = {
  events: {
    manage: 'events:manage'
  },
  groups: {
    manage: 'groups:manage'
  },
  assets: {
    manage: 'assets:manage'
  }
}

const { events, groups, assets } = scopes

const roles = {
  admin: [...Object.values(events), ...Object.values(groups), ...Object.values(assets)]
}

module.exports = {
  scopes,
  roles
}
