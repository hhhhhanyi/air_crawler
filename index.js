const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('./util/mysql.js');
const lib = require('./util/lib.js');
const errorHandling = require('./util/errorhandling.js').error;
const insertFlightData = require('./dao/crawler.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const searchRoutes = require('./routes/search');
const statisticsRoutes = require('./routes/statistics');
const crawlerListRoutes = require('./routes/crawlerList');

app.use('/api', searchRoutes);
app.use('/api', statisticsRoutes);
app.use('/api', crawlerListRoutes);

function airCrawler (resolve, reject) {
  /* database 抓爬蟲列表最後更新資料 */
  let crawlerConfig;
  let crawler = new Promise((resolve, reject) => {
    let sql = 'SELECT departure_code,arrival_code,year,month,day, d.name AS departure_name, a.name AS arrival_name FROM crawler_list LEFT JOIN location d ON (crawler_list.departure_code = d.code) LEFT JOIN location a ON (crawler_list.arrival_code = a.code) WHERE last_update = (SELECT MIN(last_update) FROM crawler_list)';
    mysql.con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (result[0]) {
        crawlerConfig = {
          departureCode: result[0].departure_code,
          arrivalCode: result[0].arrival_code,
          departureName: result[0].departure_name,
          arrivalName: result[0].arrival_name,
          year: result[0].year,
          month: result[0].month,
          day: result[0].day,
          date: `${result[0].year}-${result[0].month}-${result[0].day}`
        };
        console.log(crawlerConfig.date);
        console.log(crawlerConfig);
        resolve(crawlerConfig);
      } else {
        reject({
          error: 'failed to select crawler_list'
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
  }).then((insertSql) => {
    let delay = Math.floor(Math.random() * 10000) + 20000;
    console.log(delay);
    setTimeout(() => {
      airCrawler();
    }, delay);
  }).catch((error) => {
    /* error 處理 */
    errorHandling(error);
    /* 1 小時後重啟 */
    setTimeout(() => {
      console.log('====== error ======');
      airCrawler();
    }, 3600000);
  });
};
airCrawler();

app.use('/', express.static('public'));
app.listen(3000, () => {
  console.log('success');
});
