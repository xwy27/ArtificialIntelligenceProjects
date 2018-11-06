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
function generateChart(chartData) {
  let myChart = echarts.init(document.getElementById(chartData.title+'-chart'));

  let option = {
    title: {
        text: chartData.title
    },
    tooltip: {},
    xAxis: {
        type: 'category',
        data: chartData.x
    },
    yAxis: {
        type: 'value',
        splitLine: false
    },
    series: [{
        data: chartData.y,
        type: 'line'
    }]
  };

  myChart.setOption(option);
}

// Show chart when tab changes
generateChart(data["part1"]);
$('.tabular.menu .item').tab({
  onVisible: (tabPath) => {
    console.log(tabPath)
    generateChart(data[tabPath]);
  }
});