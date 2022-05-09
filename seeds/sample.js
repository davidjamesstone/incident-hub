const {
  Event, Group, Country, Theme, Region
} = require('../server/models/db')

exports.seed = async function (knex) {
  await Event.query().del()
  await Group.query().del()

  const ukraineCountry = await Country.query().findOne('name', 'Ukraine')
  console.log(ukraineCountry)

  const russiaEuropeRegion = await Region.query().findOne('name', 'Russia/Europe')
  console.log(russiaEuropeRegion)

  const defenceTheme = await Theme.query().findOne('name', 'Defence')
  console.log(defenceTheme)

  // https://vincit.github.io/objection.js/guide/query-examples.html#graph-inserts
  const russiaUkraineEvent = await Event.query().insertGraph({
    title: 'Last Mariupol defenders must surrender says Russia',
    description: 'Vladimir Putin says Ukraine should order its fighters remaining in Mariupol\'s besieged Azovstal steel plant to surrender',
    date: new Date().toISOString(),
    country: ukraineCountry,
    region: russiaEuropeRegion,
    source: 'multiple',
    sourceClassification: 'opensource',
    impactRating: 'medium',
    group: {
      name: 'Russia & Ukraine',
      description: '2022 Russian invasion of Ukraine',
      summary: 'Russia invaded Ukraine on 24 February 2022, marking a steep escalation of the Russo-Ukrainian War, which began in 2014 following the Ukrainian Revolution of Dignity. The invasion has caused Europe\'s largest refugee crisis since World War II, with more than 5.7 million Ukrainians leaving the country and a quarter of the population displaced.'
    },
    themes: [defenceTheme]
  }, { relate: true })
  console.log(russiaUkraineEvent)

  const events = await Group.relatedQuery('events').for(russiaUkraineEvent.group.id)

  console.log(events)
}
