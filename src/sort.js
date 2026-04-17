import { default as naturalSort } from 'string-natural-compare'

export default function (items, column, options) {
  options = options || {}
  let sortFunction = options.sortFunction || undefined
  let order = options.order || 'asc'
  let alphabet = options.alphabet || undefined
  let insensitive = options.insensitive !== undefined ? options.insensitive : true
  let caseSensitive = insensitive === false
  let multi = order === 'desc' ? -1 : 1

  if (sortFunction) {
    return items.sort(function (itemA, itemB) {
      return (
        sortFunction(itemA, itemB, {
          valueName: column,
          alphabet: alphabet,
          caseSensitive: caseSensitive,
        }) * multi
      )
    })
  } else {
    naturalSort.alphabet = alphabet
    items.sort(function (itemA, itemB) {
      let sortFunction = naturalSort.caseInsensitive
      if (!alphabet) {
        if (caseSensitive !== false) {
          sortFunction = naturalSort
        }
        return sortFunction('' + itemA.values()[column], '' + itemB.values()[column]) * multi
      } else {
        return sortFunction('' + itemA.values()[column], '' + itemB.values()[column])
      }
    })
    if (alphabet && order === 'desc') {
      items.reverse()
    }
    naturalSort.alphabet = ''
    return items
  }
}