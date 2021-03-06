import HuffManEncoder from './HuffManEncoder'
import example from '../test/resources/lorem'

test('should export a constructor', () => {
  expect(typeof HuffManEncoder).toBe('function')
  expect(typeof new HuffManEncoder('this is a test')).toBe('object')
  expect(new HuffManEncoder('this is a test')).toBeInstanceOf(HuffManEncoder)
})

const getRandomOfArray = array => array[Math.floor(Math.random() * array.length)]

const makeStringMaker = arrayOfChars => length => {
  let i = -1
  let str = ''
  while (++i < length) {
    str += getRandomOfArray(arrayOfChars)
  }
  return str
}

function createTestFromString (text, name) {
  const encoder = new HuffManEncoder(example)

  test(`should encode from ${name}`, () => {
    const rareString = makeStringMaker([encoder.getMostRareChar()[0]])(1)
    const encodedRareResult = encoder.encode(rareString, true)
    const commonString = makeStringMaker([encoder.getMostCommonChar()[0]])(1)
    const encodedCommonResult = encoder.encode(commonString, true)

    expect(encodedCommonResult.length).toBeLessThan(encodedRareResult.length)
  })
}

test('should find the most common char', () => {
  const encoder = new HuffManEncoder(example)
  expect(encoder.getMostCommonChar()).toEqual([' ', 438])
  expect(encoder.getMostRareChar()).toEqual(['E', 1])
})

test('should create serialized tree', () => {
  const encoder = new HuffManEncoder(example)
  const chars = encoder.root.char
  // @ts-ignore
  const charsWithPaths = Object.values(encoder.serializeTree())

  chars.split('').forEach(c => {
    expect(charsWithPaths).toContain(c)
  })
})

createTestFromString(example, 'lorem')
