const expected = require('./examples/all')
const actual = require('./public/all')

test('should export the same content', () => {
  expect(actual).toBe(actual)
})
