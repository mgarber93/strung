import encodableSymbols from './encodableSymbols'

const endOfFileSymbol = '.'
const numberOfEncodables = encodableSymbols.length
const bitsPerCharacter = Math.floor(Math.log2(numberOfEncodables))

export function binaryStringCompressor (binary: string) {
  let string = binary
  let output = ''

  while (string.length >= bitsPerCharacter) {
    let segment = string.slice(0, bitsPerCharacter)
    const parsedNumber = parseInt(segment, 2)
    output += encodableSymbols[parsedNumber]
    string = string.slice(bitsPerCharacter)
  }

  if (string.length) {
    output += encodableSymbols[parseInt(string, 2)] +
      Array(bitsPerCharacter - string.length).fill(endOfFileSymbol).join('')
  }

  return output
}

/**
 * bdcmp -- binary string decompressor
 * This function needs to be minified since it is included in the bundle as is...
 *
 * @param  {compressed binary sequence <string>}
 * @return {binary sequence <string>}
 */
// @ts-ignore
export function bdcmp(c) {
  let z=-1
  const s=encodableSymbols
  while (c.charAt(c.length-1-++z)===endOfFileSymbol){}
  let o=s.indexOf(c.charAt(c.length-z-1)).toString(2).padStart(bitsPerCharacter,'0').slice(z-bitsPerCharacter)
  for (let i=c.length-z-2;i>=0;i--) {o=s.indexOf(c.charAt(i)).toString(2).padStart(bitsPerCharacter, '0')+o}
  return o
}

export function makeSerializedDecompressor () {
  let decompressor = bdcmp.toString()
  const symbols = `'${encodableSymbols.join('')}'`
  decompressor = decompressor.replace(new RegExp('encodableSymbols', 'g'), symbols)
    .replace(new RegExp('endOfFileSymbol', 'g'), `'${endOfFileSymbol}'`)
    .replace(new RegExp('bitsPerCharacter', 'g'), String(bitsPerCharacter))
  return decompressor
}
