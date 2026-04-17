import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import fixtureFuzzysearch from './fixtures-fuzzysearch'
import List from '../../src/index'

describe('Fuzzy Search', function () {
  var list, itemHTML

  beforeEach(function () {
    itemHTML = fixtureFuzzysearch.list(['name', 'born'])
    list = new List(
      'list-fuzzy-search',
      {
        valueNames: ['name', 'born'],
        item: itemHTML,
      },
      fixtureFuzzysearch.all,
    )
  })

  afterEach(function () {
    fixtureFuzzysearch.removeList()
  })

  it('should have default attribute', function () {
    expect(list.fuzzySearch).toBeInstanceOf(Function)
  })

  it('should find result', function () {
    list.fuzzySearch('guybrush')
    expect(list.matchingItems.length).toBe(1)
  })

  it('should find result', function () {
    list.fuzzySearch('g thre')
    expect(list.matchingItems.length).toBe(1)
  })

  it('should find result', function () {
    list.fuzzySearch('thre')
    expect(list.matchingItems.length).toBe(4)
  })

  describe('Search field', async function () {
    it('should trigger searchStart', async () => {
      let triggered = false
      list.on('searchStart', function () { triggered = true } )
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'angelica')
      expect(triggered).toBe(true)
    })

    it('should trigger searchComplete', async () => {
      let triggered = false
      list.on('searchComplete', function () { triggered = true } )
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'angelica')
      expect(triggered).toBe(true)
    })
  })
})