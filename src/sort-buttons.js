import { default as getAttribute } from './utils/get-attribute'
import { default as classes } from './utils/classes'
import { events } from './utils/events'
import { default as sorter } from './sort'

export function getInSensitive (btn) {
  let insensitive = getAttribute(btn, 'data-insensitive')
  return insensitive !== 'false';
}
export function getNextSortOrder(btn) {
  let predefinedOrder = getAttribute(btn, 'data-order')
  if (predefinedOrder === 'asc' || predefinedOrder === 'desc') {
    return predefinedOrder
  } else if (classes(btn).has('desc')) {
    return 'asc'
  } else if (classes(btn).has('asc')) {
    return 'desc'
  } else {
    return 'asc'
  }
}
export function clearSortOrder(els) {
  for (let i = 0, il = els.length; i < il; i++) {
    classes(els[i]).remove('asc')
    classes(els[i]).remove('desc')
  }
}
export function setSortOrder(els, valueName, order) {
  for (let i = 0, il = els.length; i < il; i++) {
    let btn = els[i]
    if (getAttribute(btn, 'data-sort') !== valueName) {
      classes(btn).remove('asc')
      classes(btn).remove('desc')
      continue
    }
    let predefinedOrder = getAttribute(btn, 'data-order')
    if (predefinedOrder === 'asc' || predefinedOrder === 'desc') {
      if (predefinedOrder === order) {
        classes(btn).add(order)
        classes(btn).remove(order === 'asc' ? 'desc' : 'asc')
      } else {
        classes(btn).remove('asc')
        classes(btn).remove('desc')
      }
    } else {
      classes(btn).add(order)
      classes(btn).remove(order === 'asc' ? 'desc' : 'asc')
    }
  }
}

export function addSortListeners(elements, options) {
  options = options || {}
  let items = options.items
  let sortFunction = options.sortFunction
  let alphabet = options.alphabet
  let before = options.before
  let after = options.after
  events.bind(elements, 'click', function () {
    if (before) before()
    let target = arguments[0].currentTarget || arguments[0].srcElement || undefined
    let valueName = getAttribute(target, 'data-sort')
    let order = getNextSortOrder(target)
    let insensitive = getInSensitive(target)
    let options = {
      sortFunction: sortFunction,
      insensitive: insensitive,
      alphabet: alphabet,
      order: order,
    }
    setSortOrder(elements, valueName, order)
    sorter(items, valueName, options)
    if (after) after()
  })
}

export default {
  addSortListeners: addSortListeners,
  getInSensitive: getInSensitive,
  getNextSortOrder: getNextSortOrder,
  setSortOrder: setSortOrder,
  clearSortOrder: clearSortOrder,
}