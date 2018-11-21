export class Segment {
  content: string;
  end: number;
  isString: boolean;

  constructor (isString: boolean = false) {
    this.content = ''
    this.end = -1
    this.isString = !!isString
  }

  length() {
    return this.content.length;
  }
}

function findStrings (file: string) {
  let prevWasBackSlash = false
  let index = -1
  let segment = new Segment()
  const segments = []

  while (++index < file.length) {
    if (prevWasBackSlash) {
      prevWasBackSlash = false
      segment.content += `\${file[index]}`
    } else if (file[index] === '\\') {
      prevWasBackSlash = true
    } else if (file[index] === '"' || file[index] === '\'') {
      const shouldIncludeInCurrentSeg = segment.isString
      if (shouldIncludeInCurrentSeg) {
        segment.content += file[index]
      }

      segment.end = index
      segments.push(segment)
      segment = new Segment(!segment.isString)

      if (!shouldIncludeInCurrentSeg) {
        segment.content += file[index]
      }
    } else {
      segment.content += file[index]
    }
  }
  segments.push(segment)

  return segments
}

export default findStrings
