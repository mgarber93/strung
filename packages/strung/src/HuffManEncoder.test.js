const HuffManEncoder = require('./HuffManEncoder')

test('should export a constructor', () => {
  expect(typeof HuffManEncoder).toBe('function')
  expect(typeof new HuffManEncoder('this is a test')).toBe('object')
  expect(new HuffManEncoder('this is a test') instanceof HuffManEncoder).toBe(true)
})
