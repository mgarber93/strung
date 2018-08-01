const expected = require('./examples/skeleton')
const actual = require('./public/skeleton')

const minExpected = require('./examples/skeleton-min')
const minActual = require('./public/skeleton-min')

test('should export the same content', () => {
  expect(actual).toBe(expected)
  expect(minActual).toBe(minExpected)
})
