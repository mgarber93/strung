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
      console.assert(this.char.length === 1,
        [
          this.left && `my left is: ${this.left.char}`,
          this.right && `my right is: ${this.right.char}`,
          `im looking for: ${pattern}`
        ].join(', ')
      )
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

  toString () {
    let string = ''
    if (this.left) {
      string += this.left.toString()
    }
    if (this.char.length === 1) {
      string += this.char
    }
    if (this.right) {
      string += this.right.toString()
    }
    return string
  }
}

BITS_PER_NUMBER = 52

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

  getMostCommonChar () {
    return Object.entries(this.mapCharToFreq)
      .reduce(([maxChar, maxFreq], [char, freq]) => {
        if (!maxChar || freq > maxFreq) {
          return [char, freq]
        }
        return [maxChar, maxFreq]
      })
  }

  getMostRareChar () {
    return Object.entries(this.mapCharToFreq)
      .reduce(([minChar, minFreq], [char, freq]) => {
        if (!minChar || freq < minFreq) {
          return [char, freq]
        }
        return [minChar, minFreq]
      })
  }

  build (nodes) {
    if (nodes.length <= 1) {
      return nodes[0]
    }

    nodes.sort(function (a, b) {
      return a.freq < b.freq ? 1 : b.freq < a.freq ? -1 : 0
    })

    const lastNode = nodes.pop()
    const secondToLastNode = nodes.pop()

    nodes.push(HuffMannNode.combine(lastNode, secondToLastNode))

    return this.build(nodes)
  }

  parsingWorked (number, numberPrevious) {
    return !numberPrevious || Math.abs(number - numberPrevious) > Number.epsilon
  }

  compressString (string) {
    let i = -1
    let out = []
    while (++i < string.length) {
      if (i % BITS_PER_NUMBER === 0) {
        out.push('')
      }
      out[out.length - 1] += string[i]
    }
    // 11 char sequence
    out = out.map(n => parseInt(n, 2).toString(36))
    return `"${out.join(',')}"`
  }

  decompressString (string) {
    const numbers = string.slice(1, -1).split(',')
    return numbers.map(n => parseInt(n, 36).toString(2)).join('')
  }

  encode (string) {
    let encodedString = ''
    let index = -1

    while (++index < string.length) {
      const charAsPattern = new RegExp(string[index])
      encodedString += this.root.buildPath(charAsPattern)
    }

    const compressedString = this.compressString(encodedString)

    return encodedString
  }

  serializeTree () {
    const chars = this.root.char
    const mapPathToChar = {}

    for (let i = 0; i < chars.length; i++) {
      const charAsPattern = new RegExp(chars[i])
      mapPathToChar[this.root.buildPath(charAsPattern)] = chars[i]
    }

    return mapPathToChar
  }

  makeDecoder () {
    return `function $$$$ (str) { return ${JSON.stringify(this.serializeTree())}}\n`
  }
}

module.exports = HuffManEncoder
