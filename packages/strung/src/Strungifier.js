const HuffManEncoder = require('./HuffManEncoder')

class Segment {
  constructor (isString) {
    this.content = ''
    this.end = -1
    this.isString = !!isString
  }
}

function findStrings (file) {
  let prevWasBackSlash = false
  let index = -1
  let segment = new Segment()
  const strings = []

  while (++index < file.length) {
    if (prevWasBackSlash) {
      prevWasBackSlash = false
    } else if (file[index] === '"') {
      strings.push(segment)
      segment.end = index
      segment = new Segment(!segment.isString)
    } else {
      segment.content += file[index]
    }
  }
  strings.push(segment)

  return strings
}

class Strungifier {
  constructor (options = {}) {
    this.strings = []
    Object.assign(this, options)
  }

  strungify (file) {
    const strings = findStrings(file)

    const encoder = new HuffManEncoder(
      strings
        .filter(s => s.isString)
        .map(s => s.content)
        .join('')
    )

    strings.filter(s => s.isString)
      .forEach(string => {
        string.content = encoder.encode(string.content)
      })

    return encoder.makeDecoder() + strings.map(s => s.content).join('')
  }
}

module.exports = Strungifier
