<template>
  <svg :width="width" :height="height">
    <g v-for="el in elements">
      <polyline :points="el.d" :fill="el.fill" />
      <!-- <circle :cx="el.reference[0]" :cy="el.reference[1]" r="1" /> -->
    </g>
  </svg>
</template>

<script>
  import { flatten, map } from 'lodash'
  import { mapState, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'data'
      ]),
      ...mapState([
        'width',
        'height'
      ]),
      elements () {
        const chain = flatten(this.data, 2)
        return map(chain, datum => {
          const [ points, color, reference ] = datum
          const d = points.map(d => {
            return d.join(',')
          }).join(' ')
          return {
            d,
            fill: color,
            reference
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  polyline {
    transition: fill 2s;
  }
</style>
