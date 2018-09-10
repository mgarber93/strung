# Strung 
## A webpack minifier leveraging huffman encoding

Strung is a webpack plugin that is suitable for projects with atleast 10,000 characters of bundled strings. Currently, Strung is able to compress strings between 13-28% (depending on character frequencies), and given a worst case decoder size of 1872 chars, a worst case scenario could require 14400 characters of strings for this plugin to break even.

## Benchmarks

| file             | decoder | reduction | net   |
|------------------|---------|-----------|-------|
| large.js         | 1872    | -5994     | -4122 |
| skeleton.min.css | 1509    | -802      | +707  | 
| webpack bundle   | 1203    | -2607     | -1404 |

## Getting Started and Installing

Strung depends on node v10.7.0. Clone this repo and run ```npm run init``` from the project root. This will bootstrap each package.

## Coding style

Strung uses the [standard linting style](https://standardjs.com/)

## Built With

* [Lerna](https://lernajs.io/) - A tool for managing JavaScript projects with multiple packages.
* [Jest](https://jestjs.io/) - Delightful JavaScript Testing
