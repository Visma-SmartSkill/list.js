import { default as templater } from './templater'

export default function (initValues, options) {
  let item = this

  this._values = {}

  this.found = false
  this.filtered = false

  let init = function (values, options) {
    options = options || {}
    let element = options.element
    let template = options.template
    if (element) item.elm = element
    if (!template) throw new Error('missing_item_template')
    item.template = template
    item.values(values)
  }

  this.values = function (newValues) {
    if (newValues !== undefined) {
      for (let name in newValues) {
        item._values[name] = newValues[name]
      }
      if (item.elm) {
        templater.set(item.elm, item.values(), item.template.valueNames)
      }
    } else {
      return item._values
    }
  }

  this.matching = function (options) {
    let searched = options.searched
    let filtered = options.filtered
    return (
      (filtered && searched && item.found && item.filtered) ||
      (filtered && !searched && item.filtered) ||
      (!filtered && searched && item.found) ||
      (!filtered && !searched)
    )
  }

  init(initValues, options)
}