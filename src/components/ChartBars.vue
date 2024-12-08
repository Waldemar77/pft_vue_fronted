<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    'data.labels': {
      handler() {
        this.renderChart();
      }
    },
    'data.datasets': {
      handler() {
        this.renderChart();
      }
    }
  },
  methods: {
    renderChart() {
    if (!this.chart) {
      this.chart = new Chart(this.$refs.canvas, {
        type: 'bar',
        data: this.data,
        options: this.options
      });
    } else {
      this.chart.data = this.data;
      this.chart.update();
    }
  }
  }
};
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: auto !important;
  background-color: azure;
}
</style>
