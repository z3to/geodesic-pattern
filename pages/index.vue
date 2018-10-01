<template>
  <div class="wrapper" ref="wrapper">
    <GeodesicPattern v-if="width && height" />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import { debounce } from 'lodash'
  import GeodesicPattern from '~/components/GeodesicPattern.vue'

  export default {
    computed: {
      ...mapState([
        'width',
        'height',
        'base',
        'rest'
      ])
    },
    directives: {
    },
    components: {
      GeodesicPattern
    },
    methods: {
      ...mapActions([
        'setDimensions'
      ]),
      calcSizes: function () {
        const ref = this.$refs.wrapper
        if (typeof ref !== 'undefined') {
          const width = ref.clientWidth || ref.parentNode.clientWidth
          const height = ref.clientHeight || ref.parentNode.clientHeight
          this.setDimensions({ width, height })
        }
      }
    },
    mounted () {
      this.calcSizes()
      window.setInterval(this.calcSizes, 2000)
      window.addEventListener('resize', debounce(this.calcSizes, 300), false)
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/style/variables";

  .wrapper {
    width: 100vw;
    height: 100vh;
  }

</style>
