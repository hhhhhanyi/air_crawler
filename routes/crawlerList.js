const express = require('express');
const router = express.Router();
const mysql = require('.././util/mysql.js');

router.get('/crawler_list', (req, res) => {
  const airport = [
    'TPE_Taipei', 'HKG_Hong-Kong', 'BJS_Beijing', 'TYO_Tokyo', 'SEL_Seoul', 'BKK_Bangkok',
    'SIN_Singapore', 'KUL_Kuala-Lumpur', 'NYC_New-York', 'YVR_Vancouver', 'LAX_Los-Angeles',
    'YTO_Toronto', 'SYD_Sydney', 'LON_London', 'PAR_Paris'
  ];
  let departureCount = 0;
  let arrivalCount = 0;
  let departureCode, departureName, arrivalCode, arrivalName;
  let data = [];
  function departureCrawler () {
    arrivalCount = 0;
    if (departureCount < airport.length) {
      let city = new Promise((resolve, reject) => {
        function arrivalCrawler () {
          if (arrivalCount < airport.length) {
            if (arrivalCount !== departureCount) {
              departureCode = airport[departureCount].split('_')[0];
              departureName = airport[departureCount].split('_')[1];
              arrivalCode = airport[arrivalCount].split('_')[0];
              arrivalName = airport[arrivalCount].split('_')[1];
              for (let i = 1; i < 32; i++) {
                let day = (i + 100).toString().substr(1);
                data.push([
                  departureCode, departureName, arrivalCode, arrivalName, '2019', '05', day, 0
                ]);
              }
            }
            arrivalCount++;
            arrivalCrawler();
          }
        };
        arrivalCrawler();
        resolve();
      });
      city.then(() => {
        departureCount++;
        departureCrawler();
      }).catch(function (error) {
        console.log(error.message);
      });
    }
    let sql = 'INSERT INTO crawler_list(departure_code,departure_name,arrival_code,arrival_name,year,month,day,last_update) VALUES ?';
    mysql.con.query(sql, [data], (error, result) => {
      if (error) throw error;
      console.log(result);
    });
  };
  departureCrawler();
  res.send('success');
});

module.exports = router;
