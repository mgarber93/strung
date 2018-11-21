import {
  binaryStringCompressor,
  makeSerializedDecompressor
} from './binaryStringCompressor'

class HuffManNode {
  char: string
  freq: number
  private left: HuffManNode 
  private right: HuffManNode

  constructor (char: string, freq: number) {
    this.char = char
    this.freq = freq
    this.left = null
    this.right = null
  }

  buildPath (pattern: RegExp): string {
    if (this.left && pattern.test(this.left.char)) {
      return '0' + this.left.buildPath(pattern)
    } else if (this.right && pattern.test(this.right.char)) {
      return '1' + this.right.buildPath(pattern)
    } else {
      console.assert(this.char.length === 1,
        [
          'Didn\'t find node!',
          this.left && `left is: ${this.left.char}`,
          this.right && `right is: ${this.right.char}`,
          `looking for: ${pattern}`
        ].join(', ')
      )
      return ''
    }
  }

  static combine (nodeA: HuffManNode, nodeB: HuffManNode) {
    const parent = new HuffManNode(
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

type IMapChartToFreq = { [key: string]: number }

class HuffManEncoder {
  root: HuffManNode
  private mapCharToFreq: object
  private verbose: boolean
  private log: (...args: string[]) => void 
  private decoderSigniture?: string

  constructor (text: string, options = {}) {
    Object.assign.call(this, { 
      log: console.log,
      decoderSigniture: '$$$$',
    }, options)
    this.mapCharToFreq = text.split('')
      .reduce((acc: IMapChartToFreq, char) => {
        acc[char] = (acc[char] || 0) + 1
        return acc
      }, {})

    const nodes = Object.entries(this.mapCharToFreq)
      .map(([key, value]) => new HuffManNode(key, value))

    this.root = this.build(nodes)
  }
  
  static decoderCallLength() {
    return 4;
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

  build (nodes: Array<HuffManNode> ): HuffManNode {
    if (nodes.length <= 1) {
      return nodes[0]
    }

    nodes.sort(function (a, b) {
      return a.freq < b.freq ? 1 : b.freq < a.freq ? -1 : 0
    })

    const lastNode = nodes.pop()
    const secondToLastNode = nodes.pop()

    nodes.push(HuffManNode.combine(lastNode, secondToLastNode))

    return this.build(nodes)
  }

  parsingWorked (number: number, numberPrevious: number) {
    return !numberPrevious || Math.abs(number - numberPrevious) > Number.EPSILON
  }

  decompressString (string: string) {
    const numbers = string.slice(1, -1).split(',')
    return numbers.map(n => parseInt(n, 36).toString(2)).join('')
  }

  calculateStringReport (string: string) {
    return `${(new Set(string.split(''))).size} symbols`
  }

  encode (string: string, leaveAsBinary: boolean = false) {
    let encodedString = ''
    let index = -1

    while (++index < string.length) {
      const charAsPattern = new RegExp(this.escape(string[index]))
      encodedString += this.root.buildPath(charAsPattern)
    }

    const result = `$$$$("${
      leaveAsBinary ? encodedString : binaryStringCompressor(encodedString)
    }")`

    if (this.verbose) {
      const inputStats = this.calculateStringReport(string)
      this.log(`changed by ${
        result.length - string.length
      } characters (${
        ((result.length - string.length) * 100 / string.length).toString().substring(0, 6)
      }%) ${
        inputStats
      }`)
    }

    return result
  }

  escape (char: string) {
    return ['.', '(', ')', '[', ']', '?', '+', ',', '*', '\\'].includes(char) ? `\\${char}` : char
  }

  serializeTree () {
    const chars = this.root.char
    const mapPathToChar: {[key: string]: string} = {}

    for (let i = 0; i < chars.length; i++) {
      const charAsPattern = new RegExp(this.escape(chars[i]))
      const path = this.root.buildPath(charAsPattern)

      console.assert(
        !mapPathToChar.hasOwnProperty(path),
        `path colision at: ${path} between ${mapPathToChar[path]} and ${chars[i]}.`
      )

      mapPathToChar[path] = chars[i]
    }

    return mapPathToChar
  }

  makeDecoder () {
    const decoder = `function ${this.decoderSigniture}(c) {
  ${makeSerializedDecompressor()}
  let str = bdcmp(c)
  let i = -1
  let o = ''
  const t = ${JSON.stringify(this.serializeTree())}
  while(++i <= str.length) {
    if (t.hasOwnProperty(str.slice(0, i === 0 ? 1 : i))) {
      o += t[str.slice(0, i === 0 ? 1 : i)]
      str = str.slice(i)
      i = -1
    }
  }
  return o
}\n`
    if (this.verbose) {
      this.log(`decoder size: ${decoder.length}`)
    }
    return decoder
  }
}

export default HuffManEncoder
