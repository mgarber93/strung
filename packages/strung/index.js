#!/usr/bin/env node
const fs = require('fs')

const fileNames = fs.readdirSync('./test/examples/')

const readFileToString = path => {
  return [path, fs.readFileSync(`./test/examples/${path}`)]
}

const strung = str => str

const writeStrung = ([path, str]) => {
  return fs.writeFileSync(`./test/public/${path}`, str)
}

fileNames
  .map(readFileToString)
  .map(([filePath, content]) => [filePath, strung(content)])
  .forEach(writeStrung)
