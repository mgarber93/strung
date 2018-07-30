const expected = require('./examples/obama')
const actual = require('./public/obama')

test('should export the same content', () => {
  expect(actual).toBe(expected)
})
