const sentiment = require('sentiment')

module.exports = (script) => {
  return Object.assign(sentiment(script))
}
