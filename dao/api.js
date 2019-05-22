const mysql = require('.././util/mysql.js');

module.exports = {
  calendar: function calendar (departureCode, arrivalCode, year, month) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT min,max,med,avg,quantity,day FROM calendar where departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND year='${year}' AND month='${month}' ORDER BY day`;
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
      let sql = `SELECT calendar.min,calendar.max,calendar.med,calendar.avg,calendar.quantity,calendar.arrival_code AS airportCode,location.name AS airportName FROM calendar INNER JOIN location ON calendar.arrival_code=location.code where departure_code='${departureCode}' AND date='${date}'`;
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
      let sql = `SELECT flightNo, departure_code, arrival_code, date, cabinClass, duration_min, duration, duration_hour, departure_time, arrival_time, airline_code,departure_portCode,arrival_portCode,tax,fare,totalPrice, airline.name AS airline_name from flight INNER JOIN airline ON flight.airline_code=airline.code WHERE departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND date='${date}' ORDER BY totalPrice`;
      mysql.con.query(sql, (error, result) => {
        if (error) {
          console.log(error);
        }
        resolve(result);
      });
    });
  },
  transferFlight: function transferFlight (departureCode, arrivalCode, date, maxPrice) {
    return new Promise((resolve, reject) => {
      let departure, arrival;
      let sql = `SELECT arrival_code,GROUP_CONCAT(json_object('flightNo',flightNo,'departure_code',departure_code,'arrival_code',arrival_code,'date',date,'cabinClass',cabinClass,'duration_hour',duration_hour,'duration_min',duration_min,'duration',duration,'departure_time',departure_time,'arrival_time',arrival_time,'airline_code',airline_code,'airline_name',airline_name,'departure_portCode',departure_portCode,'arrival_portCode',arrival_portCode,'tax',tax,'fare',fare,'totalPrice',totalPrice)) as flight FROM flight WHERE departure_code='${departureCode}' && arrival_code!='${arrivalCode}' && date='${date}' && totalPrice<${maxPrice} GROUP BY arrival_code`;
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
      sql = `SELECT departure_code,GROUP_CONCAT(json_object('flightNo',flightNo,'departure_code',departure_code,'arrival_code',arrival_code,'date',date,'cabinClass',cabinClass,'duration_hour',duration_hour,'duration_min',duration_min,'duration',duration,'departure_time',departure_time,'arrival_time',arrival_time,'airline_code',airline_code,'airline_name',airline_name,'departure_portCode',departure_portCode,'arrival_portCode',arrival_portCode,'tax',tax,'fare',fare,'totalPrice',totalPrice)) as flight FROM flight WHERE arrival_code='${arrivalCode}' && departure_code!='${departureCode}' && date='${date}' && totalPrice<${maxPrice} GROUP BY departure_code`;
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
