import Vue from 'vue'
import Vuex from 'vuex'
import { times, random, flatten } from 'lodash'
import chroma from 'chroma-js'
const { config } = require('./../config.js')

Vue.use(Vuex)

const forms = [
  [
    (x, y, s) => { return [[x - s, y], [x + s, y], [x, y + s * 0.5]] },
    (x, y, s) => { return [[x - s, y + s * 0.5], [x + s, y + s * 0.5], [x, y]] }
  ],
  [
    (x, y, s) => { return [[x, y], [x - s * 1, y + s * 0.5], [x + s * 1, y + s * 0.5]] },
    (x, y, s) => { return [[x, y + s * 0.5], [x - s * 1, y], [x + s * 1, y]] }
  ]
]

// const colors = [
//   [
//     'red',
//     'blue'
//   ],
//   [
//     'green',
//     'pink'
//   ]
// ]

const scaleColumns = chroma.scale(['#1D3DCC', '#B1CC33', '#8EB3EE']).mode('lch')
const scaleRows = chroma.scale(['#4285F3', '#FFFEDF']).mode('lch')

const store = () => new Vuex.Store({
  state: {
    ...config,
    data: [],
    width: 0,
    height: 0,
    size: 20,
    counter: 0
  },
  getters: {
    data: (state) => {
      const { width, height, size } = state
      const columns = Math.ceil(width / size) + 1
      const rows = Math.ceil(height / (size * 0.5))

      let currentBaseX = 0
      const data = times(columns, column => {
        let currentBaseY = 0
        const dataColumn = times(rows, row => {
          // [column % 3, row % 3, 0]
          const points = forms[column % 2][row % 2](currentBaseX, currentBaseY, size)
          currentBaseY += size * 0.5
          return [points, [currentBaseX, currentBaseY]]
        })
        currentBaseX += size
        return dataColumn
      })
      return flatten(data, 2)
    },
    colors: (state) => {
      console.log(state.counter)
      const { width, height, size } = state
      const columns = Math.ceil(width / size) + 1
      const rows = Math.ceil(height / (size * 0.5))
      scaleColumns.domain([20, columns - 20])
      scaleRows.domain([5, rows - 5])
      const colors = times(columns, column => {
        const dataColumn = times(rows, row => {
          const colorColumn = scaleColumns(column + random(-20.0, 20.0)).hex() // scale(random(1, true)).hex()
          const colorRow = scaleRows(row + random(-5.0, 5.0)).hex()
          return chroma.mix(colorColumn, colorRow, 0.5, 'lab')
        })
        return dataColumn
      })
      return flatten(colors, 2)
    }
  },
  mutations: {
    SET_DIMENSIONS (state, { width, height }) {
      state.width = width
      state.height = height
      state.counter += 1
    }
  },
  actions: {
    setDimensions ({ state, commit }, dimensions) {
      commit('SET_DIMENSIONS', dimensions)
    }
  }
})

export default store
