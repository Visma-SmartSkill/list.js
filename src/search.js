export default function (list) {
  let columns, searchString, customSearch

  let prepare = {
    resetList: function () {
      list.i = 1
      list.templater.clear(list.list)
      customSearch = undefined
    },
    setOptions: function (args) {
      if (args.length === 2 && args[1] instanceof Array) {
        columns = args[1]
      } else if (args.length === 2 && typeof args[1] == 'function') {
        columns = undefined
        customSearch = args[1]
      } else if (args.length === 3) {
        columns = args[1]
        customSearch = args[2]
      } else {
        columns = undefined
      }
    },
    setColumns: function () {
      if (list.items.length === 0) return
      if (columns === undefined) {
        columns = list.searchColumns === undefined ? prepare.toArray(list.items[0].values()) : list.searchColumns
      }
    },
    setSearchString: function (s) {
      if (list.rememberLastSearch && s === undefined && list.lastSearch) {
        searchString = list.lastSearch
        return;
      }
      s = list.utils.toString(s).toLowerCase()
      if (list.escapeRegexChars) {
        s = s.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&') // Escape regular expression characters
      }
      searchString = s
      list.lastSearch = s;
    },
    toArray: function (values) {
      let tmpColumn = []
      for (let name in values) {
        tmpColumn.push(name)
      }
      return tmpColumn
    },
  }
  let search = {
    list: function () {
      // Extract quoted phrases "word1 word2" from original searchString
      // searchString is converted to lowercase by List.js
      let words = [],
        word_found,
        phrase,
        ss = searchString
      while ((phrase = ss.match(/"([^"]+)"/)) !== null) {
        words.push(phrase[1])
        ss = ss.substring(0, phrase.index) + ss.substring(phrase.index + phrase[0].length)
      }
      // Get remaining space-separated words (if any)
      ss = ss.trim()
      if (ss.length) words = words.concat(ss.split(/\s+/))
      for (let k = 0, kl = list.items.length; k < kl; k++) {
        let item = list.items[k]
        item.found = false
        if (!words.length) continue
        for (let i = 0, il = words.length; i < il; i++) {
          word_found = false
          for (let j = 0, jl = columns.length; j < jl; j++) {
            let values = item.values(),
              column = columns[j]
            if (values[column] && values[column] !== undefined && values[column] !== null) {
              let text = typeof values[column] !== 'string' ? values[column].toString() : values[column]
              if (text.toLowerCase().indexOf(words[i]) !== -1) {
                // word found, so no need to check it against any other columns
                word_found = true
                break
              }
            }
          }
          // this word not found? no need to check any other words, the item cannot match
          if (!word_found) break
        }
        item.found = word_found
      }
    },
    // Removed search.item() and search.values()
    reset: function () {
      list.reset.search()
      list.searched = false
    },
  }

  let searchMethod = function (str) {
    list.trigger('searchStart')

    prepare.resetList()
    prepare.setSearchString(str)
    prepare.setOptions(arguments) // str, cols|searchFunction, searchFunction
    prepare.setColumns()

    if (searchString === '') {
      search.reset()
    } else {
      list.searched = true
      if (customSearch) {
        customSearch(searchString, columns)
      } else {
        search.list()
      }
    }

    list.update()
    list.trigger('searchComplete')
    return list.visibleItems
  }

  list.handlers.searchStart = list.handlers.searchStart || []
  list.handlers.searchComplete = list.handlers.searchComplete || []

  list.utils.events.bind(
    list.utils.getByClass(list.listContainer, list.searchClass),
    'keyup',
    list.utils.events.debounce(function (e) {
      let target = e.target || e.srcElement, // IE have srcElement
        alreadyCleared = target.value === '' && !list.searched
      if (!alreadyCleared) {
        // If oninput already have resetted the list, do nothing
        searchMethod(target.value)
      }
    }, list.searchDelay)
  )

  // Used to detect click on HTML5 clear button
  list.utils.events.bind(list.utils.getByClass(list.listContainer, list.searchClass), 'input', function (e) {
    let target = e.target || e.srcElement
    if (target.value === '') {
      searchMethod('')
    }
  })

  return searchMethod
}