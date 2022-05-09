const { Event } = require('../models/db')
const Knex = require('knex')

// Initialize knex.
const knex = Knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: 'example.db'
  }
})

// Give the knex instance to objection.
Model.knex(knex)
