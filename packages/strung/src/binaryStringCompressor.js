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

function binaryStringDecompressor (compressed) {
  let segment = compressed.slice(0, 12)
  let leadingZeros = encodableSymbols.indexOf(segment[0])
  const binary = parseInt(compressed.slice(1, 12), 36).toString(2)
  const decompressed = Array(leadingZeros).fill('0').join('') + binary
  return decompressed + (compressed.length > 12 ? binaryStringDecompressor(compressed.slice(12)) : '')
}

function makeSerializedDecompressor () {
  const decompressor = binaryStringDecompressor.toString()
  const symbols = `(JSON.parse('${JSON.stringify(encodableSymbols)}'))`
  return decompressor.replace('encodableSymbols', symbols)
}

module.exports.binaryStringCompressor = binaryStringCompressor
module.exports.binaryStringDecompressor = binaryStringDecompressor
module.exports.makeSerializedDecompressor = makeSerializedDecompressor
