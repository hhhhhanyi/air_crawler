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
        resolve(result);
      });
    });
  },
  transferFlight: function transferFlight (departureCode, arrivalCode, date, maxPrice) {
    return new Promise((resolve, reject) => {
      let departure, arrival;
      let sql = `SELECT arrival_code,GROUP_CONCAT(json_object('flightNo',flightNo,'departure_code',departure_code,'arrival_code',arrival_code,'date',date,'cabinClass',cabinClass,'duration_hour',duration_hour,'duration_min',duration_min,'duration',duration,'departure_time',departure_time,'arrival_time',arrival_time,'airline_code',airline_code,'airline_name',airline_name,'departure_portCode',departure_portCode,'departure_portName',departure_portName,'arrival_portCode',arrival_portCode,'arrival_portName',arrival_portName,'tax',tax,'fare',fare,'totalPrice',totalPrice)) as flight FROM flight WHERE departure_code='${departureCode}' && arrival_code!='${arrivalCode}' && date='${date}' && totalPrice<${maxPrice} GROUP BY arrival_code`;
      mysql.con.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          for (let i = 0; i < result.length; i++) {
            result[i].flight = `[${result[i].flight}]`;
            result[i].flight = JSON.parse(result[i].flight);
          }
          departure = result;
        }
      });
      sql = `SELECT departure_code,GROUP_CONCAT(json_object('flightNo',flightNo,'departure_code',departure_code,'arrival_code',arrival_code,'date',date,'cabinClass',cabinClass,'duration_hour',duration_hour,'duration_min',duration_min,'duration',duration,'departure_time',departure_time,'arrival_time',arrival_time,'airline_code',airline_code,'airline_name',airline_name,'departure_portCode',departure_portCode,'departure_portName',departure_portName,'arrival_portCode',arrival_portCode,'arrival_portName',arrival_portName,'tax',tax,'fare',fare,'totalPrice',totalPrice)) as flight FROM flight WHERE arrival_code='${arrivalCode}' && departure_code!='${departureCode}' && date='${date}' && totalPrice<${maxPrice} GROUP BY departure_code`;
      mysql.con.query(sql, (error, result) => {
        if (error) {
          reject(error);
        } else {
          for (let i = 0; i < result.length; i++) {
            result[i].flight = `[${result[i].flight}]`;
            result[i].flight = JSON.parse(result[i].flight);
          }
          arrival = result;
          resolve([departure, arrival]);
        }
      });
    });
  }
};
