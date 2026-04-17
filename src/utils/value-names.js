import { default as getByClass } from './get-by-class'

let getDefinitionFromName = function (name, valueNames) {
  for (let i = 0, il = valueNames.length; i < il; i++) {
    let valueName = valueNames[i]
    if (valueName.data) {
      let data = valueName.data
      for (let j = 0, jl = data.length; j < jl; j++) {
        if (data[j] === name) {
          return { data: name }
        }
      }
    } else if (valueName.attr && valueName.name && valueName.name == name) {
      return valueName
    } else if (valueName === name) {
      return name
    }
  }
}
let set = function (el, name, value, valueNames) {
  let elm = undefined,
    valueName = getDefinitionFromName(name, valueNames)
  if (!valueName) return
  if (valueName.data) {
    el.setAttribute('data-' + valueName.data, value)
  } else if (valueName.attr && valueName.name) {
    elm = getByClass(el, valueName.name, true)
    if (elm) {
      elm.setAttribute(valueName.attr, value)
    }
  } else {
    elm = getByClass(el, valueName, true)
    if (elm) {
      elm.innerHTML = value
    }
  }
}

export default { getDefinitionFromName: getDefinitionFromName, set: set }