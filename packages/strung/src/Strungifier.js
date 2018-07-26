
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

  encode (string) {
    let encodedString = ''
    let index = -1

    while (++index < string.length) {
      const charAsPattern = new RegExp(string[index], 'g')
      encodedString += this.root.buildPath(charAsPattern)
    }

    return encodedString
  }
}

class Strungifier {
  constructor (options = {}) {
    this.strings = []
    Object.assign(this, options)
  }

  strungify (file) {
    const strings = findStrings(file)

    const encoder = new HuffManEncoder(strings.join(''))

    return encoder.encode(strings.join(''))
  }
}

module.exports = Strungifier
