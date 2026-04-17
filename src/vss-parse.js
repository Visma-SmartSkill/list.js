import { default as Item } from './item'

export default function (list) {
    let parse = function (element, valueNames) {
        list.items.push(new Item(valueNames, element))
    }

    return function (element) {
        parse(element, list.valueNames)
    }
}