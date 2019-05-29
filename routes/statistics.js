const express = require('express');
const router = express.Router();
const errorHandling = require('.././util/errorhandling.js').error;
const apiDAO = require('.././dao/api.js');

const location = ['TPE', 'HKG', 'BJS', 'TYO', 'SEL', 'BKK', 'SIN', 'KUL', 'NYC', 'YVR', 'LAX', 'YTO', 'SYD', 'LON', 'PAR'];
router.get('/calendar', (req, res) => {
  const departureCode = req.query.departure;
  const arrivalCode = req.query.arrival;
  const year = req.query.year;
  const month = req.query.month;
  if (location.indexOf(departureCode) >= 0 && location.indexOf(arrivalCode) >= 0 && parseInt(year) === 2019 && parseInt(month) >= 5 && parseInt(month) <= 8) {
    let week = new Date(`${year}-${month}-01`);
    week = week.getDay();
    let average = 0;
    let amount = 0;
    apiDAO.calendar(departureCode, arrivalCode, year, month).then((data) => {
      for (let i = 0; i < data.length; i++) {
        average += data[i].min;
        if (data[i].min !== 0) {
          amount++;
        } else {
          data[i].min = '-';
        }
      }
      average /= amount;
      res.send({
        statusCode: 200,
        status: 'success',
        year: year,
        month: month,
        week: week,
        average: average,
        calendar: data
      });
    }).catch((error) => {
      res.send(errorHandling({
        api: 'MAP API ERROR',
        error: error
      }));
    });
  } else {
    res.send(errorHandling({
      api: 'MAP API ERROR',
      error: req.headers
    }));
  }
});

router.get('/map', (req, res) => {
  const departureCode = req.query.departure;
  const arrivalCode = req.query.arrival;
  const date = req.query.date;
  if (location.indexOf(departureCode) >= 0 && location.indexOf(arrivalCode) >= 0 && +new Date(date) >= 1556668800000 && +new Date(date) <= 1567209600000) {
    apiDAO.map(departureCode, arrivalCode, date).then((data) => {
      res.send({
        statusCode: 200,
        status: 'success',
        departure_code: departureCode,
        date: date,
        map: data
      });
    }).catch((error) => {
      res.send(errorHandling({
        api: 'CALENDAR API ERROR',
        error: req.headers
      }));
    });
  } else {
    res.send(errorHandling({
      api: 'CALENDAR API ERROR',
      error: req.headers
    }));
  }
});

module.exports = router;
