let data = {
  part1: {
    title: 'part1',
    x: [111,145,345],
    y: [222,346,777]
  },
  part2: {
    title: 'part2',
    x: [676,345,349,239],
    y: [123,658,888,343]
  },
  part3: {
    title: 'part3',
    x: [345,145,999,585],
    y: [346,235,777,901]
  },
  part4: {
    title: 'part4',
    x: [999,585,345,145],
    y: [346,901,235,777]
  }
};

// Generate Chart by chartData
// chartData = {
//  title: 'xxx',
//  x: [xxx,xxx,xxx],
//  y: [xxx,xxx,xxx]
// }
function generateChart(chartData, chartId) {
  let myChart = echarts.init(document.getElementById(chartId+'-chart'));

  let option = {
    title: {
        text: chartData.title
    },
    tooltip: {},
    xAxis: {
        type: 'value',
        splitLine: false,
        show: false
      },
      yAxis: {
        type: 'value',
        splitLine: false,
        show: false
    },
    series: [{
        data: chartData.coordinate,
        type: 'line'
    }],
    animationDelay: function(idx) {
      return idx * 10000;
    }
  };

  myChart.setOption(option);
}

let generate = false;
let origin = {};
$(document).ready(() => {
  $.ajax({
    url: 'api/SA_origin',
    data: '',
    type: 'GET',
    async: false,
    success: (res) => {
      console.log(res['origin']);
      origin = res['origin'];
      generateChart(origin, 'part1');
    }
  });
})

// Show chart when tab changes
$('.tabular.menu .item').tab({
  onVisible: (tabPath) => {
    echarts.dispose(document.getElementById(tabPath + '-chart'));
    // TODO: get Data if generate is true
    let data = generate ? data[tabPath] : origin;
    generateChart(data, tabPath);
  }
});