
const strung = require('./index.js')

test('should import and export index', () => {
  expect(typeof strung).toBe('function')
})
