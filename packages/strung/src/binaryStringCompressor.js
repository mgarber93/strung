const encodableSymbols = require('./encodableSymbols')

const endOfFileSymbol = '.'

const numberOfEncodables = encodableSymbols.length
const bitsPerCharacter = Math.floor(Math.log2(numberOfEncodables))

function binaryStringCompressor (binary) {
  let string = binary
  let output = ''

  while (string.length >= bitsPerCharacter) {
    let segment = string.slice(0, bitsPerCharacter)
    const parsedNumber = parseInt(segment, 2)
    output += encodableSymbols[parsedNumber]
    string = string.slice(bitsPerCharacter)
  }

  if (string.length) {
    output += encodableSymbols[parseInt(string, 2)] +
      Array(bitsPerCharacter - string.length).fill(endOfFileSymbol).join('')
  }

  return output
}

/**
 * bdcmp -- binary string decompressor
 * This function needs to be minified since it is included in the bundle
 * as is...
 *
 * @param  {compressed binary sequence <string>}
 * @return {binary sequence <string>}
 */
function bdcmp (c) {
  let z = -1
  while (c.charAt(c.length - 1 - ++z) === endOfFileSymbol) {}
  let o = encodableSymbols.indexOf(c.charAt(c.length - z - 1))
    .toString(2)
    .padStart(bitsPerCharacter, '0')
    .slice(z - bitsPerCharacter)
  for (let i = c.length - z - 2; i >= 0; i--) {
    o = encodableSymbols.indexOf(c.charAt(i))
      .toString(2)
      .padStart(bitsPerCharacter, '0') + o
  }
  return o
}

function makeSerializedDecompressor () {
  let decompressor = bdcmp.toString()
  const symbols = `(JSON.parse('${JSON.stringify(encodableSymbols)}'))`
  decompressor = decompressor.replace(new RegExp('encodableSymbols', 'g'), symbols)
  decompressor = decompressor.replace(new RegExp('endOfFileSymbol', 'g'), `'${endOfFileSymbol}'`)
  decompressor = decompressor.replace(new RegExp('bitsPerCharacter', 'g'), bitsPerCharacter)
  return decompressor
}

module.exports.binaryStringCompressor = binaryStringCompressor
module.exports.bdcmp = bdcmp
module.exports.makeSerializedDecompressor = makeSerializedDecompressor
