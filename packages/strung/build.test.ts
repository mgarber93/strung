const fs = require('fs')
const fileNames = fs.readdirSync('./test/public/')

fileNames
    .filter(file => !file.startsWith('.'))
    .forEach(file => {
        test(`minified bundle ${file} should match unminified`, () => {
            let fileContents;
            try {
                fileContents = require(`./test/examples/${file}`)
            } catch (e) {
                fileContents = require(`./test/examples/${file}`).default
            }
            expect(fileContents).toBe(require(`./test/public/${file}`))
        })
    })
