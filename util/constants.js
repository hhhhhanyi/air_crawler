// Constants
module.exports = {
  PROTOCOL: 'http://',
  HOST_NAME: 'localhost:3000',
  CRAWLER: {
    url: 'https://hk.trip.com/',
    userAgent: [
      'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Mobile Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4'
    ],
    userId: [
      'bb961adf-d4af-4238-9689-03a6dc5dc81a',
      'c019a1b6-301f-4bd1-8761-dae3a50dfa4e',
      'e2381758-782e-4cbc-acc5-7e5b1e31a9c4',
      'f275e66d-cd56-468d-a01a-fb2f092bf050',
      '71ddd785-a1b0-4dc8-8233-d60b265e3ccf',
      '25ce5e49-2e14-4eaa-83a0-69daf795d8fa',
      'bfdfd862-dd04-4797-9e9a-886368d8d325',
      '8d0da2d5-4e89-4ff2-bbd4-20801974183d'
    ]
  },
  FLIGHT: {
    location: ['TPE', 'HKG', 'BJS', 'TYO', 'SEL', 'BKK', 'SIN', 'KUL', 'NYC', 'YVR', 'LAX', 'YTO', 'SYD', 'LON', 'PAR'],
    flighttype: ['direct', 'transfer'],
    timezones: [
      { lacation: 'TPE', time: 8 },
      { lacation: 'HKG', time: 8 },
      { lacation: 'BJS', time: 8 },
      { lacation: 'TYO', time: 9 },
      { lacation: 'SEL', time: 9 },
      { lacation: 'BKK', time: 7 },
      { lacation: 'SIN', time: 8 },
      { lacation: 'KUL', time: 8 },
      { lacation: 'NYC', time: -4 },
      { lacation: 'YVR', time: -7 },
      { lacation: 'LAX', time: -7 },
      { lacation: 'YTO', time: -4 },
      { lacation: 'SYD', time: 10 },
      { lacation: 'LON', time: 0 },
      { lacation: 'PAR', time: 2 }
    ]
  }
};
