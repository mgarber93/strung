function padOnLeftWithZeros (string, minSize) {
  return string.padStart(minSize, '0')
}

function binaryStringCompressor (binary) {
  const cleaned = binary.trim()
  const parsed = parseInt(cleaned.slice(0, 54), 2)
  const parsedFirst53 = parsed.toString(36)

  if (cleaned.length === 0) {
    return ''
  } if (cleaned.length < 54) {
    return parsedFirst53
  } else {
    return padOnLeftWithZeros(parsedFirst53, 11) + binaryStringCompressor(cleaned.slice(53))
  }
}

function binaryStringDecompressor (compressed) {
  const cleaned = compressed.slice(0, 12)

  const first11 = parseInt(compressed.slice(0, 12), 36).toString(2)
  if (compressed.length < 12) {
    return first11
  } else {
    return padOnLeftWithZeros(first11, 53) + binaryStringDecompressor(compressed.slice(12))
  }
}

module.exports.binaryStringCompressor = binaryStringCompressor
module.exports.binaryStringDecompressor = binaryStringDecompressor
