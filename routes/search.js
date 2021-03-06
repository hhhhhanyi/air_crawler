const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const apiDAO = require('.././dao/api');
const lib = require('.././util/lib');
const insertFlightData = require('.././dao/crawler');
const errorHandling = require('.././util/errorhandling').error;
const constants = require('.././util/constants').FLIGHT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/search', (req, res) => {
  let crawlerConfig, departureCode, arrivalCode, departureName, arrivalName;
  if (req.body.departure.indexOf('_') >= 0 && req.body.arrival.indexOf('_') >= 0) {
    departureCode = req.body.departure.split('_')[0];
    arrivalCode = req.body.arrival.split('_')[0];
    departureName = req.body.departure.split('_')[1];
    arrivalName = req.body.arrival.split('_')[1];
  }
  const date = req.body.date;
  const type = req.body.type;
  const adult = req.body.adult;
  if (constants.location.indexOf(departureCode) >= 0 && constants.location.indexOf(arrivalCode) >= 0 && +new Date(date) >= 1556668800000 && +new Date(date) <= 1567209600000 && adult < 10 && constants.flighttype.indexOf(type) >= 0) {
    const crawler = new Promise((resolve, reject) => {
      apiDAO.updateTime(departureCode, arrivalCode, date).then((result) => {
        console.log(result);
        if (+new Date() > result + 86400000 && +new Date(date) > +new Date()) {
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
        } else {
          reject({
            crawl: 'No Need To Crawl!'
          });
        }
      });
    });
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
      if (!error.crawl) {
        errorHandling(error);
      }
      console.log(error);
    }).then(() => {
      res.redirect(`../result.html?departure=${departureCode}_${departureName}&arrival=${arrivalCode}_${arrivalName}&date=${date}&p=${adult}&t=${type}`);
    });
  } else {
    errorHandling({
      api: 'SEARCH POST API ERROR',
      error: req.headers
    });
    res.redirect(`../result.html?departure=${departureCode}_${departureName}&arrival=${arrivalCode}_${arrivalName}&date=${date}&p=${adult}&t=${type}`);
  }
});

router.get('/search', (req, res) => {
  const departureCode = req.query.departure.split('_')[0];
  const arrivalCode = req.query.arrival.split('_')[0];
  const date = req.query.date;
  const type = req.query.t;
  let adult = parseInt(req.query.p);
  let locationData = [];
  let flightData = [];
  let maxPrice, arrivalTime, departureTime;
  if (adult <= 0) {
    adult = 1;
  }
  if (constants.location.indexOf(departureCode) >= 0 && constants.location.indexOf(arrivalCode) >= 0 && +new Date(date) >= 1556668800000 && +new Date(date) <= 1567209600000 && adult < 10 && constants.flighttype.indexOf(type) >= 0) {
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
          price.sort((a, b) => {
            return a.totalPrice - b.totalPrice;
          });
          let time = flightData.slice(0, flightData.length);
          time.sort((a, b) => {
            return a.total_duration - b.total_duration;
          });
          let departure = flightData.slice(0, flightData.length);
          departure.sort((a, b) => {
            return a.departure_time - b.departure_time;
          });
          let arrival = flightData.slice(0, flightData.length);
          arrival.sort((a, b) => {
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
      const transfer = new Promise((resolve, reject) => {
        apiDAO.directFlight(departureCode, arrivalCode, date).then((data) => {
          if (data.length !== 0) {
            let arrivalTimezone, departureTimezone;
            const today = +new Date(`${date} 23:59`);
            arrivalTimezone = constants.timezones.findIndex(x => x.lacation === departureCode);
            for (let i = 0; i < data.length; i++) {
              departureTimezone = constants.timezones.findIndex(x => x.lacation === data[i].arrival_code);
              if (+new Date(`${date} ${data[i].departure_time}`) + data[i].duration + (constants.timezones[departureTimezone].time - constants.timezones[arrivalTimezone].time) * 3600000 < today) {
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
        const departure = data[0];
        const arrival = data[1];
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
        price.sort((a, b) => {
          return a.totalPrice - b.totalPrice;
        });
        price = price.slice(0, 20);
        let time = flightData.slice(0, flightData.length);
        time.sort((a, b) => {
          return a.total_duration - b.total_duration;
        });
        time = time.slice(0, 20);
        let departure = flightData.slice(0, flightData.length);
        departure.sort((a, b) => {
          return a.departure_time - b.departure_time;
        });
        let arrival = flightData.slice(0, flightData.length);
        arrival.sort((a, b) => {
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
