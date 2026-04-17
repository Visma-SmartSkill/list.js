import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import List from '../../src/index'

describe('Button', function () {
  var list

  beforeEach(function () {
    const listContainer = document.createElement('div')
    listContainer.id = 'parse-list'
    listContainer.innerHTML = `
      <input class="search" />
      <span class="sort" id="sort-name" data-sort="name">Sort name</span>
      <span class="sort" id="sort-name-asc" data-sort="name" data-order="asc">Sort name asc</span>
      <span class="sort" id="sort-name-desc" data-sort="name" data-order="desc">Sort name desc</span>
      <div class="list">
        <div><span class="name">Jonny</span><span class="born">1986</span></div>
        <div><span class="name">Jocke</span><span class="born">1985</span></div>
      </div>
    `
    document.body.appendChild(listContainer)

    list = new List('parse-list', {
      valueNames: ['name', 'born'],
    })
  })

  afterEach(function () {
    const listElement = document.getElementById('parse-list')
    if (listElement) {
      listElement.remove()
    }
  })

  describe('Sort', async () => {
    it('should trigger sortStart', async () => {
      return new Promise(async(resolve) => {
        list.on('sortStart', () => {
          resolve()
        })
        const sortBtn = document.querySelector('#sort-name')
        await userEvent.click(sortBtn)
      })
    })
    it('should trigger sortComplete', async () => {
      return new Promise(async(resolve) => {
        list.on('sortComplete', () => {
          resolve()
        })
        const sortBtn = document.querySelector('#sort-name')
        await userEvent.click(sortBtn)
      })
    })

    it('should switch sorting order when clicking multiple times', async () => {
      return new Promise((resolve) => {
        const sortBtn = document.querySelector('#sort-name')
        var sortRun = 0
        list.on('sortComplete', () => {
          sortRun++
          if (sortRun == 1) {
            expect(sortBtn.classList.contains('asc')).toBe(true)
            expect(sortBtn.classList.contains('desc')).toBe(false)
            setTimeout(function () {
              sortBtn.click()
            }, 50)
          } else if (sortRun == 2) {
            expect(sortBtn.classList.contains('asc')).toBe(false)
            expect(sortBtn.classList.contains('desc')).toBe(true)
            setTimeout(function () {
              sortBtn.click()
            }, 50)
          } else if (sortRun == 3) {
            expect(sortBtn.classList.contains('asc')).toBe(true)
            expect(sortBtn.classList.contains('desc')).toBe(false)
            resolve()
          }
        })
        expect(sortBtn.classList.contains('asc')).toBe(false)
        expect(sortBtn.classList.contains('desc')).toBe(false)
        sortBtn.click()
      })
    })

    it('should sort with predefined order', () => {
      const sortBtn = document.querySelector('#sort-name')
      const sortBtnAsc = document.querySelector('#sort-name-asc')
      const sortBtnDesc = document.querySelector('#sort-name-desc')

      list.on('sortComplete', function () {
        if (sortRun === 0) {
          expect(sortBtn.classList.contains('asc')).toBe(true)
          expect(sortBtn.classList.contains('desc')).toBe(false)
          expect(sortBtnAsc.classList.contains('asc')).toBe(true)
          expect(sortBtnAsc.classList.contains('desc')).toBe(false)
          expect(sortBtnDesc.classList.contains('asc')).toBe(false)
          expect(sortBtnDesc.classList.contains('desc')).toBe(false)
        } else if (sortRun === 1) {
          expect(sortBtn.classList.contains('asc')).toBe(true)
          expect(sortBtn.classList.contains('desc')).toBe(false)
          expect(sortBtnAsc.classList.contains('asc')).toBe(true)
          expect(sortBtnAsc.classList.contains('desc')).toBe(false)
          expect(sortBtnDesc.classList.contains('asc')).toBe(false)
          expect(sortBtnDesc.classList.contains('desc')).toBe(false)
        } else if (sortRun === 2) {
          expect(sortBtn.classList.contains('asc')).toBe(true)
          expect(sortBtn.classList.contains('desc')).toBe(false)
          expect(sortBtnAsc.classList.contains('asc')).toBe(true)
          expect(sortBtnAsc.classList.contains('desc')).toBe(false)
          expect(sortBtnDesc.classList.contains('asc')).toBe(false)
          expect(sortBtnDesc.classList.contains('desc')).toBe(false)
        } else if (sortRun === 3) {
          expect(sortBtn.classList.contains('asc')).toBe(false)
          expect(sortBtn.classList.contains('desc')).toBe(true)
          expect(sortBtnAsc.classList.contains('asc')).toBe(false)
          expect(sortBtnAsc.classList.contains('desc')).toBe(false)
          expect(sortBtnDesc.classList.contains('asc')).toBe(false)
          expect(sortBtnDesc.classList.contains('desc')).toBe(true)
        } else if (sortRun === 4) {
          expect(sortBtn.classList.contains('asc')).toBe(false)
          expect(sortBtn.classList.contains('desc')).toBe(true)
          expect(sortBtnAsc.classList.contains('asc')).toBe(false)
          expect(sortBtnAsc.classList.contains('desc')).toBe(false)
          expect(sortBtnDesc.classList.contains('asc')).toBe(false)
          expect(sortBtnDesc.classList.contains('desc')).toBe(true)
        }
      })
      expect(sortBtn.classList.contains('asc')).toBe(false)
      expect(sortBtn.classList.contains('desc')).toBe(false)
      expect(sortBtnAsc.classList.contains('asc')).toBe(false)
      expect(sortBtnAsc.classList.contains('desc')).toBe(false)
      expect(sortBtnDesc.classList.contains('asc')).toBe(false)
      expect(sortBtnDesc.classList.contains('desc')).toBe(false)

      let sortRun = 0
      let runs = [
        { e: sortBtnAsc, r: 0 },
        { e: sortBtnAsc, r: 1 },
        { e: sortBtnAsc, r: 2 },
        { e: sortBtnDesc, r: 3 },
        { e: sortBtnDesc, r: 4 }
      ]

      runs.forEach(function (run) {
        sortRun = run.r
        run.e.click()
      })
    })

    it('buttons should change class when sorting programmatically', async () => {
      let triggered = false
      const sortBtn = document.querySelector('#sort-name')
      const sortBtnAsc = document.querySelector('#sort-name-asc')
      const sortBtnDesc = document.querySelector('#sort-name-desc')
      list.on('sortComplete', function () {
        expect(sortBtn.classList.contains('asc')).toBe(true)
        expect(sortBtn.classList.contains('desc')).toBe(false)
        expect(sortBtnAsc.classList.contains('asc')).toBe(true)
        expect(sortBtnAsc.classList.contains('desc')).toBe(false)
        expect(sortBtnDesc.classList.contains('asc')).toBe(false)
        expect(sortBtnDesc.classList.contains('desc')).toBe(false)
        triggered = true
      })
      list.sort('name', { order: 'asc' })
      expect(triggered).toBe(true)
    })
  })

  describe('Search', async () => {
    it('should trigger searchStart', async () => {
      let triggered = false
      list.on('searchStart', function () { triggered = true } )
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'jon')
      expect(triggered).toBe(true)
    })
    it('should trigger searchComplete', async () => {
      let triggered = false
      list.on('searchComplete', function () { triggered = true } )
      const input = screen.getByRole('textbox')
      await userEvent.type(input, 'jon')
      expect(triggered).toBe(true)
    })
  })
})