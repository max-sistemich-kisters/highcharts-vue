import { copyObject } from '../utils/tools'
import { h } from 'vue'

function destroyChart () {
  if (this && this.chart && this.chart.destroy) {
    this.chart.destroy()
  }
}

const generateVueComponent = function (Highcharts) {
  return {
    render () { return h('div', { ref: 'chart' }) },
    beforeUnmount: destroyChart,
    props: {
      constructorType: {
        type: String,
        default: 'chart'
      },
      options: {
        type: Object,
        required: true
      },
      callback: Function,
      updateArgs: {
        type: Array,
        default: () => [true, true]
      },
      highcharts: {
        type: Object
      },
      deepCopyOnUpdate: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      options: {
        handler (newValue) {
          this.chart.update(copyObject(newValue, this.deepCopyOnUpdate), ...this.updateArgs)
        },
        deep: true
      }
    },
    mounted () {
      let HC = this.highcharts || Highcharts

      if (!HC[this.constructorType]) {
        console.error(`'${this.constructorType}' constructor-type is incorrect. Sometimes this error is caused by the fact, that the corresponding module wasn't imported.`);
        return;
      }

      if (!this.options) {
        console.error('The "options" parameter was not passed.');
        return;
      }

      this.chart = HC[this.constructorType](
        this.$refs.chart,
        copyObject(this.options, true), // Always pass the deep copy when generating a chart. #80
        this.callback ? this.callback : null
      );
    }
  }
};

export default generateVueComponent;
