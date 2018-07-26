#!/usr/bin/env node
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

const writeStrung = ([path, str]) => {
  return fs.writeFileSync(`./test/public/${path}`, str)
}

fileNames
  .map(readFileToString)
  .map(([filePath, content]) => [filePath, strung()(content)])
  .forEach(writeStrung)
