const HuffManEncoder = require('./HuffManEncoder')
const segmenter = require('./Segmenter')

class Strungifier {
  constructor (options = {}) {
    this.segments = []
    Object.assign(this, options)
  }

  strungify (file) {
    const segments = segmenter(file)

    const encoder = new HuffManEncoder(
     segments
        .filter(s => s.isString)
        .map(s => s.content.slice(1, -1))
        .join(''),
      this
    )

    segments.filter(s => s.isString)
      .forEach(segment => {
        segment.content = encoder.encode(segment.content.slice(1, -1))
      })

    return encoder.makeDecoder() + segments.map(s => s.content).join('')
  }

  apply (compiler) {
    compiler.hooks.compile.tap('Strung', function (compilation, callback) {
      console.log('hello from strung')
    })
  }
}

module.exports = Strungifier
