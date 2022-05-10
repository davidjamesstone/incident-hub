const s3 = require('./s3')
const { Event, Group } = require('../models/db')
const config = require('../config')
const { bucketName, bucketPrefix } = config

const toJson = r => {
  return r && r.toJSON ? r.toJSON() : r
}
const item = async p => {
  const r = await p
  return toJson(r)
}
const list = async p => {
  const rs = await p
  return Array.isArray(rs) ? rs.map(r => toJson(r)) : rs
}

async function getAllKeys (params, allKeys = []) {
  const response = await s3.listObjectsV2(params).promise()
  response.Contents.forEach(obj => allKeys.push({
    key: obj.Key,
    filename: obj.Key.replace(params.Prefix, ''),
    size: obj.Size
  }))

  if (response.NextContinuationToken) {
    params.ContinuationToken = response.NextContinuationToken
    await getAllKeys(params, allKeys)
  }
  return allKeys
}

const impl = {
  events: {
    create: event => {
      return item(Event.query().insertGraph(event, { relate: true }))
    },
    find: () => {
      return list(Event.query().withGraphFetched('group'))
    },
    get: id => {
      return item(Event.query().withGraphFetched('[group,country,region,themes]').findById(id))
    }
  },
  group: {
    get: id => {
      return item(Group.query().findById(id))
    },
    find: () => {
      return list(Group.query())
    },
    getEvents: id => {
      return list(Event.query().where('groupId', id).withGraphFetched('[country,region,themes]'))
    }
  },
  assets: {
    find: (eventId) => {
      return getAllKeys({ Bucket: bucketName, Prefix: `${bucketPrefix}/event/${eventId}/` })
    }
  }
}

module.exports = impl

// {
//   title: 'Last Mariupol defenders must surrender says Russia',
//   description: 'Vladimir Putin says Ukraine should order its fighters remaining in Mariupol\'s besieged Azovstal steel plant to surrender',
//   date: new Date().toISOString(),
//   country: ukraineCountry,
//   region: russiaEuropeRegion,
//   group: {
//     name: 'Russia/Ukraine1',
//     description: '2022 Russian invasion of Ukraine',
//     summary: 'Russia invaded Ukraine on 24 February 2022, marking a steep escalation of the Russo-Ukrainian War, which began in 2014 following the Ukrainian Revolution of Dignity. The invasion has caused Europe\'s largest refugee crisis since World War II,[18][19] with more than 5.7 million Ukrainians leaving the country and a quarter of the population displaced.'
//   },
//   themes: [defenceTheme]
// }
