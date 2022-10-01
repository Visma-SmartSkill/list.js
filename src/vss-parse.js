module.exports = function (list) {
    var Item = require('./item')(list)

    var parse = function (element, valueNames) {
        list.items.push(new Item(valueNames, element))
    }

    return function (element) {
        parse(element, list.valueNames)
    }
}
