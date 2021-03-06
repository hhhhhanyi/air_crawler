const mysql = require('.././util/mysql.js');

module.exports = {
  calendar: (departureCode, arrivalCode, year, month) => {
    return new Promise((resolve, reject) => {
      const calendar = `SELECT min,max,med,avg,quantity,day FROM calendar where departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND year='${year}' AND month='${month}' ORDER BY day`;
      mysql.con.query(calendar, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
  map: (departureCode, arrivalCode, date) => {
    return new Promise((resolve, reject) => {
      const map = `SELECT calendar.min,calendar.max,calendar.med,calendar.avg,calendar.quantity,calendar.arrival_code AS airportCode,location.name AS airportName FROM calendar INNER JOIN location ON calendar.arrival_code=location.code where departure_code='${departureCode}' AND date='${date}'`;
      mysql.con.query(map, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
  updateTime: (departureCode, arrivalCode, date) => {
    let year, month, day;
    if (date.indexOf('-') >= 0) {
      year = date.split('-')[0];
      month = date.split('-')[1];
      day = date.split('-')[2];
    }
    return new Promise((resolve, reject) => {
      const updateTime = `SELECT last_update from crawler_list WHERE departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND year='${year}' AND month='${month}' AND day='${day}'`;
      mysql.con.query(updateTime, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result[0].last_update);
      });
    });
  },
  directFlight: (departureCode, arrivalCode, date) => {
    return new Promise((resolve, reject) => {
      const directFlight = `SELECT flightNo, departure_code, arrival_code, date, cabinClass, duration_min, duration, duration_hour, departure_time, arrival_time, airline_code, departure_portCode,arrival_portCode,tax,fare,totalPrice, airline.name AS airline_name from flight INNER JOIN airline ON flight.airline_code=airline.code WHERE departure_code='${departureCode}' AND arrival_code='${arrivalCode}' AND date='${date}' ORDER BY totalPrice`;
      mysql.con.query(directFlight, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  },
  transferFlight: (departureCode, arrivalCode, date, maxPrice) => {
    return new Promise((resolve, reject) => {
      let departure, arrival;
      const transferFlight = `SET GLOBAL group_concat_max_len = 1000000;`;
      mysql.con.query(transferFlight, (error, result) => {
        if (error) {
          reject(error);
        }
      });
      const departureSql = `SELECT arrival_code,GROUP_CONCAT(json_object('flightNo',flightNo,'departure_code',departure_code,'arrival_code',arrival_code,'date',date,'cabinClass',cabinClass,'duration_hour',duration_hour,'duration_min',duration_min,'duration',duration,'departure_time',departure_time,'arrival_time',arrival_time,'airline_code',airline_code,'airline_name',airline.name,'departure_portCode',departure_portCode,'arrival_portCode',arrival_portCode,'tax',tax,'fare',fare,'totalPrice',totalPrice)) as flight FROM flight INNER JOIN airline ON flight.airline_code = airline.code WHERE departure_code='${departureCode}' && arrival_code!='${arrivalCode}' && date='${date}' && totalPrice<${maxPrice} GROUP BY arrival_code`;
      mysql.con.query(departureSql, (error, result) => {
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
      const arrivalSql = `SELECT departure_code,GROUP_CONCAT(json_object('flightNo',flightNo,'departure_code',departure_code,'arrival_code',arrival_code,'date',date,'cabinClass',cabinClass,'duration_hour',duration_hour,'duration_min',duration_min,'duration',duration,'departure_time',departure_time,'arrival_time',arrival_time,'airline_code',airline_code,'airline_name',airline.name,'departure_portCode',departure_portCode,'arrival_portCode',arrival_portCode,'tax',tax,'fare',fare,'totalPrice',totalPrice)) as flight FROM flight INNER JOIN airline ON flight.airline_code = airline.code WHERE arrival_code='${arrivalCode}' && departure_code!='${departureCode}' && date='${date}' && totalPrice<${maxPrice} GROUP BY departure_code`;
      mysql.con.query(arrivalSql, (error, result) => {
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
