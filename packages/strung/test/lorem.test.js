const expected = require('./examples/lorem')
const actual = require('./public/lorem')

test('should export the same content', () => {
  expect(actual).toBe(expected)
})
