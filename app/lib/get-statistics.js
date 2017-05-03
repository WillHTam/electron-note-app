const readingTime = require('reading-time')
const countLines = require('count-lines')
// Using two modules to give some interesting statistics.

// module.exports = (text) => {
//   console.log('input' + text)
//   return Object.assign(readingTime(text), { lines: countLines(text) }, sentiment(text))
// }

module.exports = (text) => {
  return Object.assign(readingTime(text), { lines: countLines(text) })
}
