<template>
  <section>
    <hgroup>
      <h1>{{ target.label }}</h1>
    </hgroup>
    <figure ref="vis">
      <svg>
        <path
          v-for="(item, n) in data"
          @mouseenter="setCoords({ value: item.coords })"
          :style="{ fill: item.fill }"
          :class="{ active: n === coords }"
          :d="item.d" />
      </svg>
    </figure>
  </section>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // import chroma from 'chroma-js'
  import Scale from '~/assets/js/scale.js'
  // const color = chroma.scale(['#61B2E4', 'white', '#EA5A47']).domain([-100, 100])

  export default {
    props: ['target', 'base'],
    data: function () {
      return {
        width: 0,
        height: 0
      }
    },
    mounted () {
      this.calcSizes()
      window.addEventListener('resize', this.calcSizes, false)
    },
    computed: {
      ...mapState([
        'coords',
        'max'
      ]),
      scaleY () {
        return new Scale().domain([0, this.max + (this.base.values.length - 1) * 2]).range([1, this.height - 2])
      },
      data () {
        let s1 = (this.max - this.base.sum) / 2
        let s2 = (this.max - this.target.sum) / 2

        return this.base.values.map((l, i) => {
          const r = this.target.values[i]

          const cx1 = (this.width - 2) / 3 * 1
          const cx2 = (this.width - 2) / 3 * 2

          const x1 = 1
          const y1 = s1
          const _y1 = this.scaleY.map(y1)
          const x2 = this.width - 2
          const y2 = s2
          const _y2 = this.scaleY.map(y2)
          const x3 = this.width - 2
          const y3 = s2 + r
          const _y3 = this.scaleY.map(y3)
          const x4 = 1
          const y4 = s1 + l
          const _y4 = this.scaleY.map(y4)

          s1 = y4 + 2
          s2 = y3 + 2

          return {
            d: 'M' + x1 + ' ' + _y1 + ' C ' + cx1 + ' ' + _y1 + ' ' + cx2 + ' ' + _y2 + ' ' + x2 + ' ' + _y2 + ' L ' + x3 + ' ' + _y3 + ' C ' + cx2 + ' ' + _y3 + ' ' + cx1 + ' ' + _y4 + ' ' + x4 + ' ' + _y4 + ' Z',
            coords: i,
            fill: ['#4E40B2', '#FEAE00', '#39C88A', '#B7005E', '#1BA3D0'][i] // color(r - l)
          }
        })
      }
    },
    methods: {
      ...mapActions([
        'setCoords'
      ]),
      calcSizes: function () {
        this.width = this.$refs.vis.clientWidth || this.$refs.vis.parentNode.clientWidth
        this.height = this.$refs.vis.clientHeight || this.$refs.vis.parentNode.clientHeight
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  section {
    margin: $spacing / 2;
  }

  figure {
    height: 200px;
    width: 200px;
  }

  svg {
    height: 100%;
    width: 100%;
  }

  path {
    fill: red;
    stroke: white;
    stroke-opacity: 0;

    &.active {
      stroke: black;
      stroke-opacity: 1;
    }
  }

</style>
