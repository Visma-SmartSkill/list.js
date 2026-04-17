import { default as getByClass } from './utils/get-by-class'
import { default as getAttribute } from './utils/get-attribute'
import { default as valueNamesUtils } from './utils/value-names'

let createCleanTemplateItem = function (templateNode, valueNames) {
  let el = templateNode.cloneNode(true)
  el.removeAttribute('id')
  for (let i = 0, il = valueNames.length; i < il; i++) {
    let elm = undefined,
      valueName = valueNames[i]
    if (valueName.data) {
      for (let j = 0, jl = valueName.data.length; j < jl; j++) {
        el.setAttribute('data-' + valueName.data[j], '')
      }
    } else if (valueName.attr && valueName.name) {
      elm = getByClass(el, valueName.name, true)
      if (elm) {
        elm.setAttribute(valueName.attr, '')
      }
    } else {
      elm = getByClass(el, valueName, true)
      if (elm) {
        elm.innerHTML = ''
      }
    }
  }
  return el
}

let stringToDOMElement = function (itemHTML) {
  if (typeof itemHTML !== 'string') return undefined
  if (/<tr[\s>]/g.exec(itemHTML)) {
    let tbody = document.createElement('tbody')
    tbody.innerHTML = itemHTML
    return tbody.firstElementChild
  } else if (itemHTML.indexOf('<') !== -1) {
    let div = document.createElement('div')
    div.innerHTML = itemHTML
    return div.firstElementChild
  }
  return undefined
}

let templater = {}

templater.getTemplate = function (options) {
  options = options || {}
  let valueNames = options.valueNames
  let parentEl = options.parentEl
  let template = options.template

  if (typeof template === 'function') {
    return {
      valueNames: valueNames,
      type: 'dynamic',
      render: function (values) {
        let item = template(values)
        return stringToDOMElement(item)
      },
    }
  }

  let itemSource
  if (typeof template === 'string') {
    if (template.indexOf('<') === -1) {
      itemSource = document.getElementById(template)
    } else {
      itemSource = stringToDOMElement(template)
    }
  } else {
    let nodes = parentEl.childNodes
    for (let i = 0, il = nodes.length; i < il; i++) {
      // Only textnodes have a data attribute
      if (nodes[i].data === undefined) {
        itemSource = nodes[i].cloneNode(true)
        break
      }
    }
  }
  if (!itemSource)
    throw new Error("The list needs to have at least one item on init otherwise you'll have to add a template.")

  itemSource = createCleanTemplateItem(itemSource, valueNames)

  return {
    valueNames: valueNames,
    render: function (values) {
      let el = itemSource.cloneNode(true)
      templater.set(el, values, valueNames)
      return el
    },
  }
}

templater.get = function (el, valueNames) {
  let values = {}
  let elm
  for (let i = 0, il = valueNames.length; i < il; i++) {
    let valueName = valueNames[i]
    if (valueName.data) {
      for (let j = 0, jl = valueName.data.length; j < jl; j++) {
        values[valueName.data[j]] = getAttribute(el, 'data-' + valueName.data[j])
      }
    } else if (valueName.attr && valueName.name) {
      elm = getByClass(el, valueName.name, true)
      values[valueName.name] = elm ? getAttribute(elm, valueName.attr) : ''
    } else {
      elm = getByClass(el, valueName, true)
      values[valueName] = elm ? elm.innerHTML : ''
    }
  }
  return values
}

templater.set = function (el, values, valueNames) {
  for (let v in values) {
    if (values[v]) {
      valueNamesUtils.set(el, v, values[v], valueNames)
    }
  }
}

templater.create = function (values, template) {
  return template.render(values)
}
templater.remove = function (el, parentEl) {
  if (el !== undefined && el.parentNode === parentEl) {
    parentEl.removeChild(el)
  }
}
templater.show = function (el, parentEl) {
  parentEl.appendChild(el)
}
templater.clear = function (parentEl) {
  /* .innerHTML = ''; fucks up IE */
  if (parentEl.hasChildNodes()) {
    while (parentEl.childNodes.length >= 1) {
      parentEl.removeChild(parentEl.firstChild)
    }
  }
}

export default templater