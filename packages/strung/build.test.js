const fs = require('fs')
const fileNames = fs.readdirSync('./test/public/')

fileNames
    .filter(file => !file.startsWith('.'))
    .forEach(file => {
        test(`minified bundle ${file} should match unminified`, () => {
            expect(require(`./test/examples/${file}`)).toBe(require(`./test/public/${file}`))
        })
    })
