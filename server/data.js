const { Country, Region, Theme } = require('./models/db')

async function loadStaticData () {
  const countries = await Country.query()
  const regions = await Region.query()
  const themes = await Theme.query()

  data.countries = countries
  data.regions = regions
  data.themes = themes

  delete data.loadStaticData
}

const data = { loadStaticData }

module.exports = data
