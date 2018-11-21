if (!Object.entries) {
  Object.entries = function (obj: object) {
    var ownProps = Object.keys(obj)
    var i = ownProps.length
    var resArray = new Array(i) // preallocate the Array
    // @ts-ignore
    while (i--) { resArray[i] = [ownProps[i], obj[ownProps[i]]] }
    return resArray
  }
}
