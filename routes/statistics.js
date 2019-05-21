const express = require('express');
const router = express.Router();
const mysql = require('.././util/mysql.js');
const errorHandling = require('.././util/errorhandling.js').error;

const location = ['TPE', 'HKG', 'BJS', 'TYO', 'SEL', 'BKK', 'SIN', 'KUL', 'NYC', 'YVR', 'LAX', 'YTO', 'SYD', 'LON', 'PAR'];
router.get('/calendar', (req, res) => {
  let departureCode = req.query.departure_code;
  let arrivalCode = req.query.arrival_code;
  let year = req.query.year;
  let month = req.query.month;
  if (location.indexOf(departureCode) >= 0 && location.indexOf(arrivalCode) >= 0 && parseInt(year) === 2019 && parseInt(month) >= 5 && parseInt(month) <= 7) {
    let week = new Date(`${year}-${month}-01`);
    week = week.getDay();
    let average = 0;
    let amount = 0;
    let sql = `select min,max,med,avg,quantity,day from calendar where departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND year='${year}' AND month='${month}' ORDER BY day`;
    mysql.con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        res.send(errorHandling({
          api: 'CALENDAR API ERROR',
          error: error
        }));
      } else {
        for (let i = 0; i < result.length; i++) {
          average += result[i].min;
          if (result[i].min !== 0) {
            amount++;
          } else {
            result[i].min = '-';
          }
        }
        average /= amount;
        res.send({
          status: 'success',
          year: year,
          month: month,
          week: week,
          average: average,
          calendar: result
        });
      }
    });
  } else {
    res.send(errorHandling({
      api: 'CALENDAR API ERROR',
      error: req.headers
    }));
  }
});

router.get('/map', (req, res) => {
  let departureCode = req.query.departure;
  let arrivalCode = req.query.arrival;
  let date = req.query.date;
  if (location.indexOf(departureCode) >= 0 && location.indexOf(arrivalCode) >= 0 && +new Date(date) >= 1556668800000 && +new Date(date) <= 1564531200000) {
    let sql = `select min,max,med,avg,quantity,arrival_code AS arrival from calendar where departure_code='${departureCode}' AND date='${date}'`;
    mysql.con.query(sql, (error, result) => {
      if (error) {
        res.send(errorHandling({
          api: 'CALENDAR API ERROR',
          error: error
        }));
      }
      let mapAPI = result;
      let arrival = new Promise((resolve, reject) => {
        for (let i = 0; i < result.length; i++) {
          let sql = `select name from airport where code='${mapAPI[i].arrival}'`;
          mysql.con.query(sql, (error, result) => {
            if (error) {
              reject(error);
            }
            mapAPI[i].arrival = {
              code: mapAPI[i].arrival,
              name: result[0].name
            };
            if (i === mapAPI.length - 1) {
              resolve(mapAPI);
            }
          });
        }
      });
      arrival.then((mapAPI) => {
        res.send({
          status: 'success',
          departure_code: departureCode,
          date: date,
          map: mapAPI
        });
      }).catch((error) => {
        res.send(errorHandling({
					api: 'CALENDAR API ERROR',
					error: req.headers
				}));
      });
    });
  } else {
    res.send(errorHandling({
      api: 'CALENDAR API ERROR',
      error: req.headers
    }));
  }
});

module.exports = router;
