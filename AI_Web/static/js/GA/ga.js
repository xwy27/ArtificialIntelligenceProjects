let generate = false; // whether generate algorithm
let path = {}; // current city travel path
let SA_refresh, GA_refresh;

// Abort all ajaxs:
// Construct an arry to store all ajaxs
// When needed, abort all ajaxs in the array.
let ajaxs = [];
let oldAjax = $.ajax;
$.ajax = function() {
  let args = Array.prototype.slice.call(arguments);
  let ajax = oldAjax.apply(this, args);
  ajaxs.push(ajax);
  return ajax;
}
// Abort ajaxs and clear array
function abortAll() {
  $.each(ajaxs, function(i, ajax) {
      ajax.abort();
  });
  ajaxs = [];
}

// Generate Chart by chartData
// chartData = {
//  title: 'xxx',
//  process: 'xxx',
//  length: 'xxx',
//  coordinate: [[xxx,xxx],[xxx,xxx]...]
// }
function generateChart(chartData, chartId) {
  let myChart = echarts.init(document.getElementById(chartId + '-chart'));

  let option = {
    title: {
      text: 'Algorithm: ' + chartData.title + '\n' +
        'Process: ' + chartData.process + '%\n' +
        'Length: ' + chartData.length.toFixed(2) + 'km',
      left: 'center',
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

// Initial the chart
$(document).ready(() => {
  $.ajax({
    url: 'api/SA_origin',
    data: '',
    type: 'GET',
    async: false,
    success: (res) => {
      console.log(res['origin']);
      path = res['origin'];
      generateChart(path, 'GA');
      generateChart(path, 'SA');
    }
  });
});

// Refresh GA chart
function refreshGA(chartId) {
  return function () {
    $.ajax({
      url: 'api/GA_step',
      data: '',
      type: 'GET',
      success: (res) => {
        generateChart(res.GA, chartId);
        if (res.GA.process < 100) {
          GA = setTimeout(refreshGA(chartId), 1000);
        }
      }
    });
  };
};

// Refresh SA chart
function refreshSA(chartId) {
  return function () {
    $.ajax({
      url: 'api/SA_step',
      data: '',
      type: 'GET',
      success: (res) => {
        generateChart(res.SA, chartId);
        if (res.SA.process < 100) {
          SA = setTimeout(refreshSA(chartId), 1000);
        }
      }
    });
  };
};

// Generate chart button
$('#generate').on('click', () => {
  generate = true;
  echarts.dispose(document.getElementById('GA-chart'));
  echarts.dispose(document.getElementById('SA-chart'));
  if (generate) {
    GA = refreshGA('GA')();
    SA = refreshSA('SA')();
  } else {
    generateChart(path, 'GA');
    generateChart(path, 'SA');
  }
});

// Generate chart button
$('#clear').on('click', () => {
  generate = false;
  abortAll();
  clearTimeout(GA);
  clearTimeout(SA);
  echarts.dispose(document.getElementById('GA-chart'));
  echarts.dispose(document.getElementById('SA-chart'));
  generateChart(path, 'GA');
  generateChart(path, 'SA');

  setTimeout(() => {
    $.ajax({
      url: 'api/GA_clear',
      data: '',
      type: 'GET',
      success: (res) => {
        console.log(res['success']);
      }
    });
    $.ajax({
      url: 'api/SA_clear',
      data: '',
      type: 'GET',
      success: (res) => {
        console.log(res['success']);
      }
    });
  }, 1000);
});