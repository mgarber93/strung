const encodableSymbols = require('./encodableSymbols')

function binaryStringCompressor (binary) {
  let segment = binary.slice(0, 53)
  let leadingZeros = -1
  while (segment[++leadingZeros] === '0') {}

  const parsedNumber = parseInt(segment, 2)

  if (parsedNumber === 0) {
    leadingZeros = Math.max(leadingZeros - 1, 0)
  }

  const compressed = encodableSymbols[leadingZeros] + parsedNumber
    .toString(36)
    .padStart(11, '0')
  return compressed + (binary.length > 53 ? binaryStringCompressor(binary.slice(53)) : '')
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
  let s = c.slice(0, 12)
  let z = encodableSymbols.indexOf(s[0])
  const b = parseInt(c.slice(1, 12), 36).toString(2)
  const d = Array(z).fill('0').join('') + b
  return d + (c.length > 12 ? bdcmp(c.slice(12)) : '')
}

function makeSerializedDecompressor () {
  const decompressor = bdcmp.toString()
  const symbols = `(JSON.parse('${JSON.stringify(encodableSymbols)}'))`
  return decompressor.replace('encodableSymbols', symbols)
}

module.exports.binaryStringCompressor = binaryStringCompressor
module.exports.bdcmp = bdcmp
module.exports.makeSerializedDecompressor = makeSerializedDecompressor
