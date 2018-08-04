const HuffManEncoder = require('./HuffManEncoder')
const segmenter = require('./Segmenter')

class Strungifier {
  constructor (options = {}) {
    this.strings = []
    Object.assign(this, options)
  }

  strungify (file) {
    const strings = segmenter(file)

    const encoder = new HuffManEncoder(
      strings
        .filter(s => s.isString)
        .map(s => s.content.slice(1, -1))
        .join(''),
      this
    )

    strings.filter(s => s.isString)
      .forEach(string => {
        string.content = encoder.encode(string.content.slice(1, -1))
      })

    return encoder.makeDecoder() + strings.map(s => s.content).join('')
  }

  apply (compiler) {
    compiler.plugin('emit', function (compilation, callback) {
      console.log('emited: ', compilation, callback)
    })
  }
}

module.exports = Strungifier
