const mysql = require('.././util/mysql.js');

module.exports = {
  calendar: function calendar (departureCode, arrivalCode, year, month) {
    return new Promise((resolve, reject) => {
      let sql = `select min,max,med,avg,quantity,day from calendar where departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND year='${year}' AND month='${month}' ORDER BY day`;
      mysql.con.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
  map: function calendar (departureCode, arrivalCode, date) {
    return new Promise((resolve, reject) => {
      let sql = `select calendar.min,calendar.max,calendar.med,calendar.avg,calendar.quantity,calendar.arrival_code AS airportCode,airport.name AS airportName from calendar INNER JOIN airport ON calendar.arrival_code=airport.code where departure_code='${departureCode}' AND date='${date}'`;
      mysql.con.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
  directFlight: function directFlight (departureCode, arrivalCode, date) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * from flight WHERE departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND date='${date}' ORDER BY totalPrice`;
      mysql.con.query(sql, (error, result) => {
        if (error) {
          reject(error);
        }
      });
    });
  }
};
