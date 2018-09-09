const minExpected = require('./examples/skeleton-min')
const minActual = require('./public/skeleton-min')

test('should export the same content', () => {
  expect(minActual).toBe(minExpected)
})
