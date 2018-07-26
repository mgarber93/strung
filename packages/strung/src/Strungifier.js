
function findStrings (file) {
  let prevWasBackSlash = false
  let isInString = false
  let index = -1
  let run = ''
  const strings = []

  while (++index < file.length) {
    if (prevWasBackSlash) {
      prevWasBackSlash = false
    } else if (file[index] === '"') {
      if (isInString) {
        strings.push(run)
        run = ''
      }
      isInString = !isInString
    } else if (isInString) {
      run += file[index]
    }
  }

  return strings
}

class Node {
  constructor (char, freq) {
    this.char = char
    this.freq = freq
    this.left = null
    this.right = null
  }
}

class HuffMannEncoding {
  constructor (text) {
    this.mapCharToFreq = text.split('')
      .reduce((acc, char) => {
        acc[char] = (acc[char] || 0) + 1
        return acc
      }, {})
  }
}

class Strungifier {
  constructor (options = {}) {
    this.strings = []
    Object.assign(this, options)
  }

  strungify (file) {
    const strings = findStrings(file)
    return file
  }
}

module.exports = Strungifier
