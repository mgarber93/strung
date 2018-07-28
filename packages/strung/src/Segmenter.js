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
  const segments = []

  while (++index < file.length) {
    if (prevWasBackSlash) {
      prevWasBackSlash = false
    } else if (file[index] === '"') {
      const shouldIncludeInCurrentSeg = segment.isString
      if (shouldIncludeInCurrentSeg) {
        segment.content += file[index]
      }

      segments.push(segment)
      segment.end = index
      segment = new Segment(!segment.isString)

      if (!shouldIncludeInCurrentSeg) {
        segment.content += file[index]
      }
    } else {
      segment.content += file[index]
    }
  }
  segments.push(segment)

  return segments
}

module.exports = findStrings
