const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const apiDAO = require('.././dao/api.js');
const lib = require('.././util/lib.js');
const insertFlightData = require('.././dao/crawler.js');
const errorHandling = require('.././util/errorhandling.js').error;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const location = ['TPE', 'HKG', 'BJS', 'TYO', 'SEL', 'BKK', 'SIN', 'KUL', 'NYC', 'YVR', 'LAX', 'YTO', 'SYD', 'LON', 'PAR'];
const flighttype = ['direct', 'transfer'];
const timezones = [
  { lacation: 'TPE', time: 8 },
  { lacation: 'HKG', time: 8 },
  { lacation: 'BJS', time: 8 },
  { lacation: 'TYO', time: 9 },
  { lacation: 'SEL', time: 9 },
  { lacation: 'BKK', time: 7 },
  { lacation: 'SIN', time: 8 },
  { lacation: 'KUL', time: 8 },
  { lacation: 'NYC', time: -4 },
  { lacation: 'YVR', time: -7 },
  { lacation: 'LAX', time: -7 },
  { lacation: 'YTO', time: -4 },
  { lacation: 'SYD', time: 10 },
  { lacation: 'LON', time: 0 },
  { lacation: 'PAR', time: 2 }
];

router.post('/search', (req, res) => {
  let crawlerConfig, departureCode, arrivalCode, departureName, arrivalName;
  if (req.body.departure.indexOf('_') >= 0 && req.body.arrival.indexOf('_') >= 0) {
    departureCode = req.body.departure.split('_')[0];
    arrivalCode = req.body.arrival.split('_')[0];
    departureName = req.body.departure.split('_')[1];
    arrivalName = req.body.arrival.split('_')[1];
  }
  let date = req.body.date;
  let type = req.body.type;
  let adult = req.body.adult;
  if (location.indexOf(departureCode) >= 0 && location.indexOf(arrivalCode) >= 0 && +new Date(date) >= 1556668800000 && +new Date(date) <= 1567209600000 && adult < 10 && flighttype.indexOf(type) >= 0) {
    let crawler = new Promise((resolve, reject) => {
      crawlerConfig = {
        departureCode: departureCode,
        arrivalCode: arrivalCode,
        departureName: departureName,
        arrivalName: arrivalName,
        year: date.split('-')[0],
        month: date.split('-')[1],
        day: date.split('-')[2],
        date: date
      };
      resolve(crawlerConfig);
    });
    /* 排除過去資料 */
    if (+new Date(date) > +new Date()) {
      crawler.then((crawlerConfig) => {
        /* Request API */
        return lib.requestAPI(crawlerConfig);
      }).then((flightData) => {
        /* 整理當日航班資訊、統計每日航班價格 */
        return lib.createFlightData(crawlerConfig, flightData);
      }).then((data) => {
        /* 輸入 Database */
        return insertFlightData.crawler(crawlerConfig, data[0], data[1]);
      }).catch((error) => {
        errorHandling(error);
      }).then(() => {
        res.redirect(`../result.html?departure=${departureCode}&arrival=${arrivalCode}&date=${date}&p=${adult}&t=${type}`);
      });
    } else {
      res.redirect(`../result.html?departure=${departureCode}&arrival=${arrivalCode}&date=${date}&p=${adult}&t=${type}`);
    }
  } else {
    errorHandling({
      api: 'SEARCH POST API ERROR',
      error: req.headers
    });
    res.redirect(`../result.html?departure=${departureCode}&arrival=${arrivalCode}&date=${date}&p=${adult}&t=${type}`);
  }
});

router.get('/search', (req, res) => {
  let departureCode = req.query.departure;
  let arrivalCode = req.query.arrival;
  let date = req.query.date;
  let adult = parseInt(req.query.p);
  let type = req.query.t;
  let locationData = [];
  let flightData = [];
  let maxPrice, arrivalTime, departureTime;
  if (adult <= 0) {
    adult = 1;
  }
  if (location.indexOf(departureCode) >= 0 && location.indexOf(arrivalCode) >= 0 && +new Date(date) >= 1556668800000 && +new Date(date) <= 1564531200000 && adult < 10 && flighttype.indexOf(type) >= 0) {
    if (type === 'direct') {
      console.log('direct');
      apiDAO.directFlight(departureCode, arrivalCode, date).then((data) => {
        if (data.length !== 0) {
          for (let i = 0; i < data.length; i++) {
            flightData.push({
              type: 'direct',
              total_duration: data[i].duration,
              totalPrice: data[i].totalPrice * adult,
              departure_time: +new Date(`${date} ${data[i].departure_time}`),
              arrival_time: +new Date(`${date} ${data[i].departure_time}`) + (data[i].duration * 60000),
              flight: [data[i]]
            });
          }
          let price = flightData.slice(0, flightData.length);
          price.sort(function (a, b) {
            return a.totalPrice - b.totalPrice;
          });
          let time = flightData.slice(0, flightData.length);
          time.sort(function (a, b) {
            return a.total_duration - b.total_duration;
          });
          let departure = flightData.slice(0, flightData.length);
          departure.sort(function (a, b) {
            return a.departure_time - b.departure_time;
          });
          let arrival = flightData.slice(0, flightData.length);
          arrival.sort(function (a, b) {
            return a.arrival_time - b.arrival_time;
          });
          res.send({
            statusCode: 200,
            status: 'success',
            flight: [
              price, time, departure, arrival
            ]
          });
        }
      }).catch((error) => {
        res.send(errorHandling({
          api: 'SEARCH GET API ERROR',
          error: req.headers
        }));
      });
    } else {
      console.log('transfer');
      let transfer = new Promise((resolve, reject) => {
        apiDAO.directFlight(departureCode, arrivalCode, date).then((data) => {
          if (data.length !== 0) {
            let arrivalTimezone, departureTimezone;
            let today = +new Date(`${date} 23:59`);
            arrivalTimezone = timezones.findIndex(x => x.lacation === departureCode);
            for (let i = 0; i < data.length; i++) {
              departureTimezone = timezones.findIndex(x => x.lacation === data[i].arrival_code);
              if (+new Date(`${date} ${data[i].departure_time}`) + data[i].duration + (timezones[departureTimezone].time - timezones[arrivalTimezone].time) * 3600000 < today) {
                flightData.push({
                  type: 'direct',
                  total_duration: data[i].duration,
                  totalPrice: data[i].totalPrice * adult,
                  departure_time: +new Date(`${date} ${data[i].departure_time}`),
                  arrival_time: +new Date(`${date} ${data[i].departure_time}`) + (data[i].duration * 60000),
                  flight: [data[i]]
                });
              }
            }
            maxPrice = data[data.length - 1].totalPrice;
          } else {
            maxPrice = 9999999999;
          }
          return maxPrice;
        }).then((maxPrice) => {
          apiDAO.transferFlight(departureCode, arrivalCode, date, maxPrice).then((data) => {
            resolve(data);
          }).catch((error) => {
            res.send(errorHandling({
              api: 'SEARCH GET API ERROR',
              error: req.headers
            }));
          });
        }).catch((error) => {
          res.send(errorHandling({
            api: 'SEARCH GET API ERROR',
            error: req.headers
          }));
        });
      });
      transfer.then((data) => {
        let departure = data[0];
        let arrival = data[1];
        // 配對相同地點
        for (let i = 0; i < departure.length; i++) {
          for (let k = 0; k < arrival.length; k++) {
            if (departure[i].arrival_code === arrival[k].departure_code) {
              locationData.push({
                location: departure[i].arrival_code,
                flight: [departure[i].flight, arrival[k].flight]
              });
              break;
            }
          }
        }
      }).then(() => {
        // 配對轉機航班
        for (let i = 0; i < locationData.length; i++) {
          // 依出發地
          for (let m = 0; m < locationData[i].flight[0].length; m++) {
            // 依目的地
            for (let n = 0; n < locationData[i].flight[1].length; n++) {
              arrivalTime = +new Date(`${date} ${locationData[i].flight[0][m].arrival_time}`);
              departureTime = +new Date(`${date} ${locationData[i].flight[1][n].departure_time}`);
              if (locationData[i].flight[0][m].totalPrice + locationData[i].flight[1][n].totalPrice < maxPrice && departureTime - arrivalTime > 3600000) {
                flightData.push({
                  type: 'transfer',
                  transfer_duration: (departureTime - arrivalTime) / 60000,
                  total_duration: (departureTime - arrivalTime) / 60000 + locationData[i].flight[0][m].duration + locationData[i].flight[1][n].duration,
                  totalPrice: (locationData[i].flight[0][m].totalPrice + locationData[i].flight[1][n].totalPrice) * adult,
                  departure_time: +new Date(`${date} ${locationData[i].flight[0][m].departure_time}`),
                  arrival_time: +new Date(`${date} ${locationData[i].flight[0][m].departure_time}`) + (departureTime - arrivalTime) + (locationData[i].flight[0][m].duration + locationData[i].flight[1][n].duration) * 60000,
                  flight: [
                    locationData[i].flight[0][m],
                    locationData[i].flight[1][n]
                  ]
                });
              }
            }
          }
        }
        return flightData;
      }).then((flightData) => {
        let price = flightData.slice(0, flightData.length);
        price.sort(function (a, b) {
          return a.totalPrice - b.totalPrice;
        });
        price = price.slice(0, 20);
        let time = flightData.slice(0, flightData.length);
        time.sort(function (a, b) {
          return a.total_duration - b.total_duration;
        });
        time = time.slice(0, 20);
        let departure = flightData.slice(0, flightData.length);
        departure.sort(function (a, b) {
          return a.departure_time - b.departure_time;
        });
        let arrival = flightData.slice(0, flightData.length);
        arrival.sort(function (a, b) {
          return a.arrival_time - b.arrival_time;
        });
        res.send({
          statusCode: 200,
          status: 'success',
          flight: [
            price, time, departure, arrival
          ]
        });
      }).catch((error) => {
        res.send(errorHandling({
          api: 'TRANSFER FLIGHT API ERROR',
          error: error
        }));
      });
    }
  } else {
    res.send(errorHandling({
      api: 'SEARCH GET API ERROR',
      error: req.headers
    }));
  }
});

module.exports = router;
