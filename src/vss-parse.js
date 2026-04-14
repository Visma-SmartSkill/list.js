var Item = require('./item')
module.exports = function (list) {
    var parse = function (element, valueNames) {
        list.items.push(new Item(valueNames, element))
    }

    return function (element) {
        parse(element, list.valueNames)
    }
}