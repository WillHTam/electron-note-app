const readingTime = require('reading-time')
const countLines = require('count-lines')
const sentiment = require('sentiment')

module.exports = (text) => {
  return Object.assign(sentiment(text), readingTime(text), { lines: countLines(text) })
}
