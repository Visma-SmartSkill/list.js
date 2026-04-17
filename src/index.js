import { default as naturalSort } from 'string-natural-compare'
import { default as getByClass } from './utils/get-by-class'
import { default as extend } from './utils/extend'
import { default as indexOf } from './utils/index-of'
import { events } from './utils/events'
import { default as toString } from './utils/to-string'
import { default as classes } from './utils/classes'
import { default as getAttribute } from './utils/get-attribute'
import { default as toArray } from './utils/to-array'
import { default as templater } from './templater'
import { default as Item } from './item'
import { default as sort } from './sort'
import { default as sortButtons } from './sort-buttons'
import { default as vssParse } from './vss-parse'
import { default as parse } from './parse'
import { default as search } from './search'
import { default as filter } from './filter'
import { default as fuzzySearch } from './fuzzy-search'
import { default as addAsyncFn } from './add-async'
import { default as initPaginationFn } from './pagination'

let addSortListeners = sortButtons.addSortListeners
let clearSortOrder = sortButtons.clearSortOrder
let setSortOrder = sortButtons.setSortOrder

export default function (id, options, values) {
  let self = this,
    init,
    addAsync = addAsyncFn(self),
    initPagination = initPaginationFn(self)

  init = {
    start: function () {
      self.listClass = 'list'
      self.searchClass = 'search'
      self.sortClass = 'sort'
      self.page = 10000
      self.i = 1
      self.items = []
      self.visibleItems = []
      self.matchingItems = []
      self.searched = false
      self.filtered = false
      self.escapeRegexChars = true
      self.rememberLastSearch = false
      self.searchColumns = undefined
      self.searchDelay = 0
      self.handlers = { updated: [] }
      self.valueNames = []
      self.utils = {
        getByClass: getByClass,
        extend: extend,
        indexOf: indexOf,
        events: events,
        toString: toString,
        naturalSort: naturalSort,
        classes: classes,
        getAttribute: getAttribute,
        toArray: toArray,
      }

      self.utils.extend(self, options)

      self.listContainer = typeof id === 'string' ? document.getElementById(id) : id
      if (!self.listContainer) {
        return
      }
      self.list = getByClass(self.listContainer, self.listClass, true)

      self.parse = parse(self)
      self.templater = templater
      self.parseElement = vssParse
      self.template = self.templater.getTemplate({
        parentEl: self.list,
        valueNames: self.valueNames,
        template: self.item,
      })
      self.search = search(self)
      self.filter = filter(self)
      self.fuzzySearch = fuzzySearch(self, options.fuzzySearch)

      this.handlers()
      this.items()
      this.pagination()
      this.sort()

      self.update()
    },
    handlers: function () {
      for (let handler in self.handlers) {
        if (self[handler] && self.handlers[handler]) {
          self.on(handler, self[handler])
        }
      }
    },
    items: function () {
      self.parse(self.list)
      if (values !== undefined) {
        self.add(values)
      }
    },
    pagination: function () {
      if (options.pagination !== undefined) {
        if (options.pagination === true) {
          options.pagination = [{}]
        }
        if (options.pagination[0] === undefined) {
          options.pagination = [options.pagination]
        }
        for (let i = 0, il = options.pagination.length; i < il; i++) {
          initPagination(options.pagination[i])
        }
      }
    },
    sort: function () {
      let sortButtons = self.utils.getByClass(self.listContainer, self.sortClass)
      let items = self.items
      let sortFunction = self.sortFunction
      let alphabet = self.alphabet
      let before = function () {
        self.trigger('sortStart')
      }
      let after = function () {
        self.update()
        self.trigger('sortComplete')
      }
      addSortListeners(sortButtons, {
        items: items,
        sortFunction: sortFunction,
        alphabet: alphabet,
        before: before,
        after: after,
      })

      self.handlers.sortStart = self.handlers.sortStart || []
      self.handlers.sortComplete = self.handlers.sortComplete || []
      self.on('searchStart', function () {
        clearSortOrder(sortButtons)
      })
      self.on('filterStart', function () {
        clearSortOrder(sortButtons)
      })
      self.sort = function (valueName, options) {
        options = options || {}
        before()
        setSortOrder(sortButtons, valueName, options.order)
        options.alphabet = options.alphabet || self.alphabet
        options.sortFunction = options.sortFunction || self.sortFunction
        options.valueName = valueName
        sort(items, valueName, options)
        after()
        return items
      }
    },
  }

  /*
   * Re-parse the List, use if html have changed
   */
  this.reIndex = function () {
    self.items = []
    self.visibleItems = []
    self.matchingItems = []
    self.searched = false
    self.filtered = false
    self.parse(self.list)
  }

  this.addElement = function(element) {
    if (element.parentNode === self.list) {
      self.parseElement(element);
    }
  }

  this.toJSON = function () {
    let json = []
    for (let i = 0, il = self.items.length; i < il; i++) {
      json.push(self.items[i].values())
    }
    return json
  }

  /*
   * Add object to list
   */
  this.add = function (values, callback) {
    if (values.length === 0) {
      return
    }
    if (callback) {
      addAsync(values.slice(0), callback)
      return
    }
    let added = []
    if (values[0] === undefined) {
      values = [values]
    }
    for (let i = 0, il = values.length; i < il; i++) {
      let item = new Item(values[i], { template: self.template })
      self.items.push(item)
      added.push(item)
    }
    self.update()
    return added
  }

  this.show = function (i, page) {
    this.i = i
    this.page = page
    self.update()
    return self
  }

  /* Removes object from list.
   * Loops through the list and removes objects where
   * property "valuename" === value
   */
  this.remove = function (valueName, value) {
    let found = 0
    for (let i = 0, il = self.items.length; i < il; i++) {
      if (self.items[i].values()[valueName] === value) {
        self.templater.remove(self.items[i].elm, self.list)
        self.items.splice(i, 1)
        il--
        i--
        found++
      }
    }
    self.update()
    return found
  }

  /* Gets the objects in the list which
   * property "valueName" === value
   */
  this.get = function (valueName, value) {
    let matchedItems = []
    for (let i = 0, il = self.items.length; i < il; i++) {
      let item = self.items[i]
      if (item.values()[valueName] === value) {
        matchedItems.push(item)
      }
    }
    return matchedItems
  }

  /*
   * Get size of the list
   */
  this.size = function () {
    return self.items.length
  }

  /*
   * Removes all items from the list
   */
  this.clear = function () {
    self.templater.clear(self.list)
    self.items = []
    return self
  }

  this.on = function (event, callback) {
    self.handlers[event].push(callback)
    return self
  }

  this.off = function (event, callback) {
    let e = self.handlers[event]
    let index = indexOf(e, callback)
    if (index > -1) {
      e.splice(index, 1)
    }
    return self
  }

  this.trigger = function (event) {
    let i = self.handlers[event].length
    while (i--) {
      self.handlers[event][i](self)
    }
    return self
  }

  this.reset = {
    filter: function () {
      let is = self.items,
        il = is.length
      while (il--) {
        is[il].filtered = false
      }
      return self
    },
    search: function () {
      let is = self.items,
        il = is.length
      while (il--) {
        is[il].found = false
      }
      return self
    },
  }

  this.update = function () {
    let is = self.items,
      il = is.length

    self.visibleItems = []
    self.matchingItems = []
    self.templater.clear(self.list)
    for (let i = 0; i < il; i++) {
      if (is[i].matching(self) && self.matchingItems.length + 1 >= self.i && self.visibleItems.length < self.page) {
        if (!is[i].elm) {
          is[i].elm = templater.create(is[i].values(), self.template)
        }
        templater.show(is[i].elm, self.list)
        self.visibleItems.push(is[i])
        self.matchingItems.push(is[i])
      } else if (is[i].matching(self)) {
        self.matchingItems.push(is[i])
        templater.remove(is[i].elm, self.list)
      } else {
        templater.remove(is[i].elm, self.list)
      }
    }
    self.trigger('updated')
    return self
  }

  init.start()
}