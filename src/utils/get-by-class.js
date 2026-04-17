/**
 * A cross-browser implementation of getElementsByClass.
 * Heavily based on Dustin Diaz's function: http://dustindiaz.com/getelementsbyclass.
 *
 * Find all elements with class `className` inside `container`.
 * Use `single = true` to increase performance in older browsers
 * when only one element is needed.
 *
 * @param {String} className
 * @param {Element} container
 * @param {Boolean} single
 * @api public
 */

let getElementsByClassName = function (container, className, single) {
  if (single) {
    return container.getElementsByClassName(className)[0]
  } else {
    return container.getElementsByClassName(className)
  }
}

let querySelector = function (container, className, single) {
  className = '.' + className
  if (single) {
    return container.querySelector(className)
  } else {
    return container.querySelectorAll(className)
  }
}

let polyfill = function (container, className, single) {
  let classElements = [],
    tag = '*'

  let els = container.getElementsByTagName(tag)
  let elsLen = els.length
  let pattern = new RegExp('(^|\\s)' + className + '(\\s|$)')
  for (let i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className)) {
      if (single) {
        return els[i]
      } else {
        classElements[j] = els[i]
        j++
      }
    }
  }
  return classElements
}

export default (function () {
  return function (container, className, single, options) {
    options = options || {}
    if ((options.test && options.getElementsByClassName) || (!options.test && document.getElementsByClassName)) {
      return getElementsByClassName(container, className, single)
    } else if ((options.test && options.querySelector) || (!options.test && document.querySelector)) {
      return querySelector(container, className, single)
    } else {
      return polyfill(container, className, single)
    }
  }
})()