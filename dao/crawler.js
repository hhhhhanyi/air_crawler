const mysql = require('.././util/mysql.js');
const errorHandling = require('.././util/errorhandling.js').error;

module.exports = {
  crawler: function crawlerData (crawlerConfig, flightData, statisticsData) {
    let sql;
    return new Promise((resolve, reject) => {
      mysql.con.beginTransaction((error) => {
        if (error) {
          errorHandling(error);
        }
        sql = `UPDATE crawler_list SET last_update='${+new Date()}' WHERE departure_code='${crawlerConfig.departureCode}' && arrival_code='${crawlerConfig.arrivalCode}' && year='${crawlerConfig.year}' && month='${crawlerConfig.month}' && day='${crawlerConfig.day}'`;
        mysql.con.query(sql, (error) => {
          if (error) {
            return mysql.con.rollback(() => {
              console.log(1, error);
              errorHandling(error);
            });
          }
        });
        sql = `DELETE FROM flight WHERE departure_code='${crawlerConfig.departureCode}' && arrival_code='${crawlerConfig.arrivalCode}' && date='${crawlerConfig.date}'`;
        mysql.con.query(sql, (error) => {
          if (error) {
            return mysql.con.rollback(() => {
              console.log(2, error);
              errorHandling(error);
            });
          }
        });
        if (flightData.length > 0) {
          sql = 'INSERT INTO flight(departure_code,arrival_code,flightNo,date,cabinClass,duration_hour,duration_min,duration,departure_time,arrival_time,airline_code,airline_name,departure_portCode,departure_portName,arrival_portCode,arrival_portName,fare,tax,totalPrice) VALUES ?';
          mysql.con.query(sql, [flightData], (error, result) => {
            if (error) {
              return mysql.con.rollback(() => {
                console.log(3, error);
                errorHandling(error);
              });
            }
          });
        }
        sql = `DELETE FROM calendar WHERE departure_code='${crawlerConfig.departureCode}' && arrival_code='${crawlerConfig.arrivalCode}' && year='${crawlerConfig.year}' && month='${crawlerConfig.month}' && day='${crawlerConfig.day}'`;
        mysql.con.query(sql, (error) => {
          if (error) {
            return mysql.con.rollback(() => {
              console.log(4, error);
              errorHandling(error);
            });
          }
        });
        sql = 'INSERT INTO calendar SET ?';
        mysql.con.query(sql, statisticsData, (error) => {
          if (error) {
            return mysql.con.rollback(() => {
              console.log(5, error);
              errorHandling(error);
            });
          }
          mysql.con.commit((error) => {
            resolve();
            if (error) {
              console.log(6, error);
              return mysql.con.rollback(() => {
                errorHandling(error);
              });
            }
          });
        });
      });
    });
  }
};
