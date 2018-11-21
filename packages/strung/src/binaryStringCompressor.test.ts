const {binaryStringCompressor, bdcmp} = require('./binaryStringCompressor')

const makeBinarySequence = length => {
  let i = -1
  let binarySequence = ''
  while (++i < length) {
    binarySequence += Math.random() < 0.5 ? 0 : 1
  }
  return binarySequence
}

function testBinarySequence (binarySequence, name) {
  const compressedSequence = binaryStringCompressor(binarySequence)
  const actual = bdcmp(compressedSequence)
  test(`${name} from: ${compressedSequence} got: ${actual}`, () => {
    expect(actual).toBe(binarySequence)
  })
}

const lengthsToTest = [1, 15, 40, 53, 200]

testBinarySequence('0000001110001001010110111100111001110010', 'should work with leading 0s')

lengthsToTest.forEach(length => {
  testBinarySequence(
    makeBinarySequence(length),
    `should compress a binary string of length ${length}`
  )
})
