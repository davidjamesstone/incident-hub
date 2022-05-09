const dayjs = require('./date')
const { DATE_FORMAT } = require('../../constants')

function date (date, format = DATE_FORMAT) {
  return dayjs(date).format(format)
}

function fromNow (date, noSuffix = false) {
  return dayjs(date).fromNow(noSuffix)
}

module.exports = { date, fromNow }
