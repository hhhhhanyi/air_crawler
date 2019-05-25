let calendarGlobal;

fetch(`/api/calendar?departure=${departureCode}&arrival=${arrivalCode}&year=${year}&month=${month}`)
.then((response) => {
    return response.json();
}).then((calendarAPI) => {
    calendarGlobal = calendarAPI;
    if (calendarAPI.status === 'error') {
      let calendar = `
      <div class="row" id="error">
        <div class="col-sm-4">
          <img src="pic/alert.svg" id="errorImg">
          </div>
          <div class="col-sm-8" id="errorMessage">
          <b id="sorry">Sorry!</b>
          <p id="errorMsg">${calendarAPI.error}</p>
          </div>
      </div>`;
      return ['error', calendar];
    } else {
      document.getElementById('map').textContent = `${date} 從 ${departureCode} 到其他地的價格（TWD）`
      let week = calendarAPI.week;
      let year = calendarAPI.year;
      let month = calendarAPI.month;
      let calendarDate;
      document.getElementById('year').textContent = year;
      document.getElementById('month').textContent = month;
      let calendar = '';
      for (let i = 0; i < week; i++) {
        calendar += '<li></li>'
      }
      for (let k = 0; k < calendarAPI.calendar.length; k++) {
        calendarDate = (parseInt(k + 1, 10) + 100).toString().substr(1)
        calendar += `<li><a href="/result.html?departure=${departureCode}&arrival=${arrivalCode}&date=${year}-${month}-${calendarDate}&p=${person}&t=${type}">
        <p class="calendar_date">${calendarDate}</p>
        `
        if (calendarAPI.calendar[k].min > calendarAPI.average) {
          calendar += `<p class="calendar_dollar" style="color: red">NT$</p>
          <p class="calendar_price high" id="calendar_price_${k}">${calendarAPI.calendar[k].min.toLocaleString()}</p></a></li>`;
        } else {
          calendar += `<p class="calendar_dollar" style="color: green">NT$</p>
          <p class="calendar_price" id="calendar_price_${k}">${calendarAPI.calendar[k].min.toLocaleString()}</p></a></li>`;
        }
      }
      if (week + calendarAPI.calendar.length < 35) {
        for (let i = 0; i < 35 - week - calendarAPI.calendar.length; i++) {
          calendar += '<li></li>'
        }
      } else {
        for (let i = 0; i < 42 - week - calendarAPI.calendar.length; i++) {
          calendar += '<li></li>'
        }
      }
      return ['success', calendar];
    }
}).then((calendar) => {
    if (calendar[0] === 'error') {
      document.getElementById('nav-calendar').innerHTML = calendar[1];
    } else {
      document.getElementById('days').innerHTML += calendar[1];
    }
}).catch((error) => {
    console.log(error);
});

function map() {
  fetch(`/api/map?departure=${departureCode}&arrival=${arrivalCode}&date=${date}`)
    .then((response) => {
      return response.json();
    }).then((mapAPI) => {
      if (mapAPI.status === 'error') {
        document.getElementById('map_div').innerHTML = `
          <div class="row" id="error">
            <div class="col-sm-4">
              <img src="pic/alert.svg" id="errorImg">
            </div>
            <div class="col-sm-8" id="errorMessage">
              <b id="sorry">Sorry!</b>
              <p id="errorMsg">${mapAPI.error}</p>
            </div>
          </div>`;
        return 'error';
      } else {
        let mapData = [];
        let map = new Promise((resolve, reject) => {
          for (let i = 0; i < mapAPI.map.length; i++) {
            if (mapAPI.map[i].min !== 0) {
              mapData.push([
                mapAPI.map[i].airportName,
                mapAPI.map[i].min
              ]);
            }
            if (i === mapAPI.map.length - 1) {
              resolve(mapData);
            }
          }
        });
        return map;
      }
    }).then((map) => {
      if (map !== 'error') {
        google.charts.load('current', {
          'packages': ['geochart'],
          'mapsApiKey': 'AIzaSyCaZw4PhUuT3GDYQgUMqXydpu2EyqHlciE'
        });
        google.charts.setOnLoadCallback(drawMarkersMap);
        function drawMarkersMap() {
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'City');
          data.addColumn('number', '最低價格');
          data.addRows(map);
          var options = {
            interpolateNulls: true,
            displayMode: 'markers',
            // colorAxis: {colors: ['yellow','red']},
            legend: {
              textStyle: {
                fontName: 'Courier, Arial',
                color: 'black',
                fontSize: 15
              }
            },
            sizeAxis: { minValue: 0, maxSize: 15 },
            colorAxis: { colors: ['#f9d423', '#e14fad'] }
          };
          var chart = new google.visualization.GeoChart(document.getElementById('map_div'));
          google.visualization.events.addListener(chart, 'select', function () {
            var selection = chart.getSelection();
            if (selection.length > 0) {
              console.log(data.getValue(selection[0].row, 0));
              let place = [ 'TPE_Taipei', 'HKG_Hong-Kong', 'BJS_Beijing', 'TYO_Tokyo', 'SEL_Seoul', 'BKK_Bangkok', 'SIN_Singapore', 'KUL_Kuala-Lumpur', 'NYC_New-York', 'YVR_Vancouver', 'LAX_Los-Angeles', 'YTO_Toronto', 'SYD_Sydney', 'LON_London', 'PAR_Paris' ];
              let selectedArrival;
              for (let i = 0; i < place.length; i++) {
                if (data.getValue(selection[0].row, 0) === place[i].split("_")[1]) {
                  selectedArrival = place[i].split("_")[0];
                }
              }
              window.location.href = `/result.html?departure=${departureCode}&arrival=${selectedArrival}&date=${date}&p=${person}&t=${type}`;
            }
          });
          chart.draw(data, options);
        }
      }
    }).catch((error) => {
      console.log(error);
    });
}

function chart () {
  let chartPromise = new Promise((resolve, reject) => {
    if (calendarGlobal.status === 'error') {
      document.getElementById('nav-chart').innerHTML = `
      <div class="row" id="error">
        <div class="col-sm-4">
          <img src="pic/alert.svg" id="errorImg">
        </div>
        <div class="col-sm-8" id="errorMessage">
          <b id="sorry">Sorry!</b>
          <p id="errorMsg">${calendarGlobal.error}</p>
        </div>
      </div>`;
      resolve(['error']);
    } else {
      let priceArray = [
        ['日期', '最低價', '最高價', '中位數', '平均價']
      ]
      for (let i = 0; i < calendarGlobal.calendar.length; i++) {
        priceArray.push([
          calendarGlobal.calendar[i].day,
          calendarGlobal.calendar[i].min,
          calendarGlobal.calendar[i].max,
          calendarGlobal.calendar[i].med,
          calendarGlobal.calendar[i].avg
        ]);
      }

      let flightArray = [
        ['日期', '航班數量']
      ]
      for (let i = 0; i < calendarGlobal.calendar.length; i++) {
        flightArray.push([
          calendarGlobal.calendar[i].day,
          calendarGlobal.calendar[i].quantity
        ]);
      }
      setTimeout(() => {
        resolve([ 'success', priceArray, flightArray ]);
      }, 1000);
    }
  });
  chartPromise.then((chartData) => {
    if (chartData[0] !== 'error') {
      google.charts.load('current', { packages: ['line'] });
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var data = google.visualization.arrayToDataTable(chartData[1]);
        var options = {
          chart: {
            title: '價格走勢',
            subtitle: '每日航班的最低價、最高價、平均價與中位數 (TWD)'
          },
          legend: {
            position: 'bottom',
            alignment: 'center'
          }
        };
        var chart = new google.charts.Line(document.getElementById('price_div'));
        chart.draw(data, google.charts.Line.convertOptions(options));
      }

      google.charts.load('current', { 'packages': ['bar'] });
      google.charts.setOnLoadCallback(drawCharts);
      function drawCharts() {
        var data = google.visualization.arrayToDataTable(chartData[2]);
        var options = {
          chart: {
            title: '航班走勢',
            subtitle: '每日航班數量（班）',
          },
          chartArea:{
            left:100,width:'100%'
          },
          legend: {
            position: 'none'
          }
        };
        var chart = new google.charts.Bar(document.getElementById('quantity_div'));
        chart.draw(data, google.charts.Bar.convertOptions(options));
      }
    }
  }).catch((error) => {
    console.log(error);
  });
}
