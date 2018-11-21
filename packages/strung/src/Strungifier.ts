import HuffManEncoder from './HuffManEncoder'
import segmenter from './Segmenter'
import { Segment } from './Segmenter'
import { Compiler } from 'webpack'

function segmentIsCompressableString(s: Segment) {
  return s.isString && s.length() > HuffManEncoder.decoderCallLength();
}

class Strungifier {
  private segments?: Array<string>;

  constructor (options = {}) {
    this.segments = []
    Object.assign(this, options)
  }

  strungify (file: string) {
    const segments = segmenter(file)

    const encoder = new HuffManEncoder(
      segments
        .filter(segmentIsCompressableString)
        .map(s => s.content.slice(1, -1))
        .join(''),
      this
    )

    segments
      .filter(segmentIsCompressableString)
      .forEach(segment => {
        segment.content = encoder.encode(segment.content.slice(1, -1))
      })

    return encoder.makeDecoder() + segments.map(s => s.content).join('')
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap('Strung', compilation => {
      compilation.hooks
        .succeedModule
        .tap('Strung', webpackModule => {
          // @ts-ignore
          const input = webpackModule._source.source()
          const ouput = this.strungify(input)
          // @ts-ignore
          webpackModule._source._value = ouput
        })
    })

    compiler.hooks.emit.tap('Strung', function (compilation) {
      let filelist = 'In this build:\n\n'
      for (let filename in compilation.assets) {
        filelist += ('- ' + filename + '\n')
      }

      compilation.assets['strung-results.md'] = {
        source: function () {
          return filelist
        },
        size: function () {
          return filelist.length
        }
      }
    })
  }
}

export default Strungifier
