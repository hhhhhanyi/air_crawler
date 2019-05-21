const constants = require('.././util/constants.js');
const request = require('request');

function statistics (price) {
  let minPrice, maxPrice, mePrice, avgPrice, quantity;
  if (price && typeof price === 'object' && price.length > 0) {
    /* 資料依價錢排序 */
    price.sort((a, b) => {
      return a - b;
    });
    quantity = price.length;
    /* 中位數 */
    if (price.length % 2 === 0) {
      mePrice = Math.round((price[price.length / 2 - 1] + price[(price.length / 2)]) / 2);
    } else {
      mePrice = price[(price.length + 1) / 2 - 1];
    }
    minPrice = price[0];
    maxPrice = price[price.length - 1];
    avgPrice = 0;
    for (let k = 0; k < price.length; k++) {
      avgPrice += price[k];
    }
    avgPrice /= price.length;
    return ([mePrice, minPrice, maxPrice, avgPrice, quantity]);
  } else {
    /* 無當日航班 */
    mePrice = 0;
    minPrice = 0;
    maxPrice = 0;
    avgPrice = 0;
    quantity = 0;
    return ([mePrice, minPrice, maxPrice, avgPrice, quantity]);
  }
};

function createFlightData (crawlerConfig, flightData) {
  return new Promise((resolve, reject) => {
    let price = [];
    let data = [];
    for (let i = 0; i < flightData.productInfoList.length; i++) {
      if (flightData.productInfoList[i].flightInfoList.length === 1) {
        data.push([
          crawlerConfig.departureCode, crawlerConfig.arrivalCode,
          flightData.productInfoList[i].flightInfoList[0].flightNo,
          flightData.productInfoList[i].filterInfo.dDateStr,
          flightData.productInfoList[i].flightInfoList[0].cabinClass,
          flightData.productInfoList[i].flightInfoList[0].durationInfo.hour,
          flightData.productInfoList[i].flightInfoList[0].durationInfo.min,
          flightData.productInfoList[i].flightInfoList[0].durationInfo.hour * 60 + flightData.productInfoList[i].flightInfoList[0].durationInfo.min,
          flightData.productInfoList[i].filterInfo.dTimeStr,
          flightData.productInfoList[i].filterInfo.aTimeStr,
          flightData.productInfoList[i].flightInfoList[0].airlineInfo.code,
          flightData.productInfoList[i].flightInfoList[0].airlineInfo.name,
          flightData.productInfoList[i].flightInfoList[0].dPortInfo.code,
          flightData.productInfoList[i].flightInfoList[0].dPortInfo.name,
          flightData.productInfoList[i].flightInfoList[0].aPortInfo.code,
          flightData.productInfoList[i].flightInfoList[0].aPortInfo.name,
          flightData.productInfoList[i].policyInfoList[0].priceDetailInfo.adult.fare,
          flightData.productInfoList[i].policyInfoList[0].priceDetailInfo.adult.tax,
          flightData.productInfoList[i].policyInfoList[0].priceDetailInfo.adult.totalPrice
        ]);
        price.push(flightData.productInfoList[i].policyInfoList[0].priceDetailInfo.adult.totalPrice);
      }
    };
    let statisticsPrice = statistics(price);
    let statisticsData = {
      avg: statisticsPrice[3],
      min: statisticsPrice[1],
      max: statisticsPrice[2],
      med: statisticsPrice[0],
      quantity: statisticsPrice[4],
      last_update: +new Date(),
      departure_code: crawlerConfig.departureCode,
      arrival_code: crawlerConfig.arrivalCode,
      date: crawlerConfig.date,
      year: crawlerConfig.year,
      month: crawlerConfig.month,
      day: crawlerConfig.day
    };
    resolve([data, statisticsData]);
  });
};

function requestAPI (crawlerConfig) {
  return new Promise((resolve, reject) => {
    let randomNumber = Math.floor(Math.random() * 8);
    let options = {
      url: `${constants.CRAWLER.url}flightapi/flightSearch`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': constants.CRAWLER.url,
        'Referer': `${constants.CRAWLER.url}flights/${crawlerConfig.departureName}-to-${crawlerConfig.arrivalName}/tickets-${crawlerConfig.departureCode.toLowerCase()}-${crawlerConfig.arrivalCode.toLowerCase()}/?flighttype=s&dcity=${crawlerConfig.departureCode}&acity=${crawlerConfig.arrivalCode}&startdate=${crawlerConfig.date}&class=ys&quantity=1&searchboxarg=t`,
        'User-Agent': constants.CRAWLER.userAgent[randomNumber],
        'Cookie': `_abtest_userid=${constants.CRAWLER.userId[randomNumber]}; ibulanguage=hk; ibulocale=zh_hk; cookiePricesDisplayed=TWD; ibu_h5_lang=hk; ibu_h5_local=zh-hk; ibu_h5_group=trip; ibu_h5_curr=HKD; ibu_h5_site=HK;`
      },
      json: {
        searchNo: '1',
        mode: 0,
        productKeyInfo: null,
        searchInfo: {
          tripType: 'OW',
          cabinClass: 'YS',
          travelerNum: {
            adult: 1,
            child: 0,
            infant: 0
          },
          searchSegmentList: [{
            dCityCode: crawlerConfig.departureCode,
            aCityCode: crawlerConfig.arrivalCode,
            dDate: crawlerConfig.date
          }]
        }
      }
    };
    console.log(options.headers);
    request(options, (error, res, body) => {
      if (error) {
        reject({
          error: error,
          request: `=== requestAPI ERROR ===\n${crawlerConfig.date} ${crawlerConfig.departureCode} ${crawlerConfig.arrivalCode}\n${error}`
        });
      }
      if (body && body.responseHead) {
        if (body.responseHead.errorCode === '0') {
          resolve(body);
        } else {
          reject({
            error: error,
            request: `=== requestAPI ERROR ===\n${crawlerConfig.date} ${crawlerConfig.departureCode} ${crawlerConfig.arrivalCode}\n${JSON.stringify(body)}`
          });
        }
      } else {
        reject({
          error: error,
          request: `=== body.responseHead.errorCode ERROR ===\n${body}`
        });
      }
    });
  });
};

module.exports = {
  statistics: statistics,
  createFlightData: createFlightData,
  requestAPI: requestAPI
};
