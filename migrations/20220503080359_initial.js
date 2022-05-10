const {
  INCIDENT_HUB_SCHEMA_NAME
} = require('../constants')

function addTimestamps (knex, table) {
  table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now())
  table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())
}

exports.up = function (knex) {
  const uuid = knex.raw('uuid_generate_v4()')

  return knex
    .raw(`
      CREATE SCHEMA ${INCIDENT_HUB_SCHEMA_NAME};
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `)
    .then(() => {
      return knex.schema.withSchema(INCIDENT_HUB_SCHEMA_NAME)
        .createTable('group', t => {
          // Add columns
          t.specificType('id', 'uuid').notNullable().primary().defaultTo(uuid)
          t.string('name', 100).notNullable().unique()
          t.string('description', 300).notNullable()
          t.string('summary', 1000).notNullable()

          addTimestamps(knex, t)
        })
        .createTable('theme', t => {
          // Add columns
          t.specificType('id', 'uuid').notNullable().primary().defaultTo(uuid)
          t.string('name', 255).notNullable().unique()

          addTimestamps(knex, t)
        })
        .createTable('region', t => {
          // Add columns
          t.specificType('id', 'uuid').notNullable().primary().defaultTo(uuid)
          t.string('name', 255).notNullable().unique()

          addTimestamps(knex, t)
        })
        .createTable('country', t => {
          // Add columns
          t.specificType('id', 'uuid').notNullable().primary().defaultTo(uuid)
          t.string('name', 255).notNullable().unique()

          addTimestamps(knex, t)
        })
        .createTable('event', t => {
          // Add columns
          t.specificType('id', 'uuid').notNullable().primary().defaultTo(uuid)
          t.string('title', 255).notNullable()
          t.string('description', 5000).notNullable()
          t.timestamp('date').notNullable().index()
          t.timestamp('publishedDate').nullable().index()
          t.specificType('groupId', 'uuid').references('id')
            .inTable(`${INCIDENT_HUB_SCHEMA_NAME}.group`).nullable()
          t.specificType('regionId', 'uuid').references('id')
            .inTable(`${INCIDENT_HUB_SCHEMA_NAME}.region`).notNullable()
          t.specificType('countryId', 'uuid').references('id')
            .inTable(`${INCIDENT_HUB_SCHEMA_NAME}.country`).notNullable()
          t.enu('source', ['single', 'multiple']).notNullable()
          t.enu('sourceClassification', ['opensource', 'official']).notNullable()
          t.enu('impactRating', ['low', 'medium', 'high']).notNullable()
          t.string('caveats', 1000).nullable()

          addTimestamps(knex, t)
        })
        .createTable('eventTheme', t => {
          // Add columns
          t.specificType('id', 'uuid').notNullable().primary().defaultTo(uuid)
          t.specificType('eventId', 'uuid').references('id')
            .inTable(`${INCIDENT_HUB_SCHEMA_NAME}.event`).notNullable()
            .onDelete('CASCADE')
          t.specificType('themeId', 'uuid').references('id')
            .inTable(`${INCIDENT_HUB_SCHEMA_NAME}.theme`).notNullable()
            .onDelete('CASCADE')

          // Constraints
          t.unique(['eventId', 'themeId'])

          addTimestamps(knex, t)
        })
    })
}

exports.down = function (knex) {
  return knex.raw(`
    DROP SCHEMA ${INCIDENT_HUB_SCHEMA_NAME} CASCADE;
    DROP EXTENSION IF EXISTS "uuid-ossp";
  `)
}
