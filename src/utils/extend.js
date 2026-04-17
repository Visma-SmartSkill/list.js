/*
 * Source: https://github.com/segmentio/extend
 */

export default function extend(object) {
  // Takes an unlimited number of extenders.
  let args = Array.prototype.slice.call(arguments, 1)

  // For each extender, copy their properties on our object.
  for (let i = 0, source; (source = args[i]); i++) {
    if (!source) continue
    for (let property in source) {
      object[property] = source[property]
    }
  }

  return object
}