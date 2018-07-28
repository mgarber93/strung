const encode = require('./index')
const example = require('./test/examples/lorem')
const exampleActual = require('./test/public/lorem')

test('should encode lorem', () => {
  expect(exampleActual).toBe(example)
})
