let generate = false; // whether generate algorithm
let path = {}; // current city travel path

// Generate Chart by chartData
// chartData = {
//  title: 'xxx',
//  x: [xxx,xxx,xxx],
//  y: [xxx,xxx,xxx]
// }
function generateChart(chartData, chartId) {
  let myChart = echarts.init(document.getElementById(chartId + '-chart'));

  let option = {
    title: {
      text: 'Algorithm: ' + chartData.title + '\n' +
        'Process: ' + chartData.process + '%\n' +
        'Length: ' + chartData.length.toFixed(2) + 'km'
    },
    tooltip: {
      formatter: function (params) {
        var data = params.data || [0, 0];
        return 'City: ' + data[0] + ', ' + data[1];
      }
    },
    xAxis: {
      splitLine: false,
      show: false
    },
    yAxis: {
      splitLine: false,
      show: false
    },
    series: generate ? [{
      data: chartData.coordinate,
      type: 'line'
    }] : [{
      symbolSize: 5,
      data: chartData.coordinate,
      type: 'scatter'
    }],
    animationDelay: function (idx) {
      return idx * 10;
    }
  };

  myChart.setOption(option);
}

$(document).ready(() => {
  $.ajax({
    url: 'api/SA_origin',
    data: '',
    type: 'GET',
    async: false,
    success: (res) => {
      console.log(res['origin']);
      path = res['origin'];
      generateChart(path, 'part1');
    }
  });
});

// Show chart when tab changes
function refresh(tabPath) {
  return function () {
    $.ajax({
      url: 'api/SA_step',
      data: '',
      type: 'GET',
      async: false,
      success: (res) => {
        // console.log(res);
        generateChart(res.SA, tabPath);
        if (res.SA.process < 100) {
          setTimeout(refresh(tabPath), 1000);
        }
      }
    });
  };
};

$('.tabular.menu .item').tab({
  onVisible: (tabPath) => {
    echarts.dispose(document.getElementById(tabPath + '-chart'));
    // TODO: get Data if generate is true
    if (generate) {
      refresh(tabPath)();
    } else {
      generateChart(path, tabPath);
    }
  }
});

// Generate chart button
$('#generate').on('click', () => {
  generate = true;
});