export default function (list) {
  let addAsync = function (values, callback, items) {
    let valuesToAdd = values.splice(0, 50)
    items = items || []
    items = items.concat(list.add(valuesToAdd))
    if (values.length > 0) {
      setTimeout(function () {
        addAsync(values, callback, items)
      }, 1)
    } else {
      list.update()
      callback(items)
    }
  }
  return addAsync
}