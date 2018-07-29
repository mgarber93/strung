#!/usr/bin/env node

require('./src/polyfill')
const fs = require('fs')
const Strungifier = require('./src/Strungifier')

const fileNames = fs.readdirSync('./test/examples/')
const readFileToString = path => {
  const file = fs.readFileSync(`./test/examples/${path}`, {encoding: 'utf-8'})
  return [path, file]
}

const strung = options => {
  const strungifier = new Strungifier(options)
  return strungifier.strungify.bind(strungifier)
}

const writeStrung = ([path, actual, expected]) => {
  return fs.writeFileSync(`./test/public/${path}`, actual)
}

fileNames
  .map(readFileToString)
  .map(([filePath, content]) => [filePath, strung()(content), content])
  .forEach(writeStrung)
