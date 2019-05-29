const mysql = require('.././util/mysql.js');
const errorHandling = require('.././util/errorhandling.js').error;

module.exports = {
  crawler: (crawlerConfig, flightData, statisticsData) => {
    return new Promise((resolve, reject) => {
      mysql.con.beginTransaction((error) => {
        if (error) {
          errorHandling(error);
        }
        const updateTime = `UPDATE crawler_list SET last_update='${+new Date()}' WHERE departure_code='${crawlerConfig.departureCode}' && arrival_code='${crawlerConfig.arrivalCode}' && year='${crawlerConfig.year}' && month='${crawlerConfig.month}' && day='${crawlerConfig.day}'`;
        mysql.con.query(updateTime, (error) => {
          if (error) {
            return mysql.con.rollback(() => {
              errorHandling(error);
            });
          }
        });
        const flight = new Promise((resolve, reject) => {
          const deleteOldData = `DELETE FROM flight WHERE departure_code='${crawlerConfig.departureCode}' && arrival_code='${crawlerConfig.arrivalCode}' && date='${crawlerConfig.date}'`;
          mysql.con.query(deleteOldData, (error) => {
            if (error) {
              return mysql.con.rollback(() => {
                errorHandling(error);
              });
            }
            resolve();
          });
        });
        flight.then(() => {
          if (flightData.length > 0) {
            const insertNewData = 'INSERT INTO flight(departure_code,arrival_code,flightNo,date,cabinClass,duration_hour,duration_min,duration,departure_time,arrival_time,airline_code,airline_name,departure_portCode,departure_portName,arrival_portCode,arrival_portName,fare,tax,totalPrice) VALUES ?';
            mysql.con.query(insertNewData, [flightData], (error, result) => {
              if (error) {
                return mysql.con.rollback(() => {
                  errorHandling(error);
                });
              }
            });
          }
        });
        const statistics = new Promise((resolve, reject) => {
          const deleteOldData = `DELETE FROM calendar WHERE departure_code='${crawlerConfig.departureCode}' && arrival_code='${crawlerConfig.arrivalCode}' && year='${crawlerConfig.year}' && month='${crawlerConfig.month}' && day='${crawlerConfig.day}'`;
          mysql.con.query(deleteOldData, (error) => {
            if (error) {
              return mysql.con.rollback(() => {
                errorHandling(error);
              });
            }
            resolve();
          });
        });
        statistics.then(() => {
          const insertNewData = 'INSERT INTO calendar SET ?';
          mysql.con.query(insertNewData, statisticsData, (error) => {
            if (error) {
              return mysql.con.rollback(() => {
                errorHandling(error);
              });
            }
            mysql.con.commit((error) => {
              resolve();
              if (error) {
                return mysql.con.rollback(() => {
                  errorHandling(error);
                });
              }
            });
          });
        });
      });
    });
  }
};
