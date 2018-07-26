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

class HuffMannNode {
  constructor (char, freq) {
    this.char = char
    this.freq = freq
    this.left = null
    this.right = null
  }

  buildPath (pattern) {
    if (this.left && pattern.test(this.left.char)) {
      return '0' + this.left.buildPath(pattern)
    } else if (this.right && pattern.test(this.right.char)) {
      return '1' + this.right.buildPath(pattern)
    } else {
      return ''
    }
  }

  static combine (nodeA, nodeB) {
    const parent = new HuffMannNode(
      nodeA.char + nodeB.char,
      nodeA.freq + nodeB.freq
    )

    parent.left = nodeA
    parent.right = nodeB

    return parent
  }
}

class HuffManEncoder {
  constructor (text) {
    this.mapCharToFreq = text.split('')
      .reduce((acc, char) => {
        acc[char] = (acc[char] || 0) + 1
        return acc
      }, {})

    const nodes = Object.entries(this.mapCharToFreq)
      .map(([key, value]) => new HuffMannNode(key, value))

    this.root = this.build(nodes)
    this.BITS_PER_NUMBER = 53
  }

  build (nodes) {
    if (nodes.length <= 1) {
      return nodes[0]
    }

    nodes.sort(function (a, b) {
      return a.freq < b.freq
    })

    const lastNode = nodes.pop()
    const secondToLastNode = nodes.pop()

    nodes.push(HuffMannNode.combine(lastNode, secondToLastNode))

    return this.build(nodes)
  }

  parsingWorked (number, numberPrevious) {
    return !numberPrevious || Math.abs(number - numberPrevious) > Number.epsilon
  }

  formatString (string) {
    let i = -1
    let out = []
    while (++i < string.length) {
      if (i % this.BITS_PER_NUMBER === 0) {
        out.push('')
      }
      out[out.length - 1] += string[i]
    }
    // 11 char sequence
    out = out.map(n => `"${parseInt(n, 2).toString(36)}"`)
    return out
  }
  encode (string) {
    let encodedString = ''
    let index = -1

    while (++index < string.length) {
      const charAsPattern = new RegExp(string[index], 'g')
      encodedString += this.root.buildPath(charAsPattern)
    }

    return this.formatString(encodedString)
  }
}

class Strungifier {
  constructor (options = {}) {
    this.strings = []
    Object.assign(this, options)
  }

  strungify (file) {
    const strings = findStrings(file)

    const encoder = new HuffManEncoder(strings.map(s => s.content).join(''))

    strings.filter(s => s.isString)
      .forEach(string => {
        string.content = encoder.encode(string.content)
      })

    return strings.map(s => s.content).join('')
  }
}

module.exports = Strungifier
