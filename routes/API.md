## Search API
- **End Point:** `/search`
- **Method:** `POST`
- **Request Headers:**

Field        | Type      | Description       |
---------    | --------- | ---------------   |
Content-Type | String    | application/json  |


- **Request Body:**

Field     | Type      | Description     |
--------- | --------- | --------------- |
departure | String    | 本次旅程的出發地   |
arrival   | String    | 本次旅程的目的地   |
date      | String    | 本次旅程的日期    |
adult     | Number    | 本次旅程的出發人數 |
type      | String    | 航班的飛行方式 ex.直飛轉機 |

- **Request Body Example:**

>
	{
		departure: TPE_Taipei,
		arrival: HKG_Hong-Kong,
		date: 2019-05-20,
		adult: 1,
		type: direct
	}

## Search API

- **End Point**: `/search`
- **Method**: `GET`
- **Query Parameters**

Field     | Type      | Description     |
--------- | --------- | --------------- |
departure | String    | 本次旅程的出發地   |
arrival   | String    | 本次旅程的目的地   |
date      | String    | 本次旅程的日期     |
p         | Number    | 本次旅程的出發人數 |
t         | String    | 航班的飛行方式 ex.直飛轉機 |

- **Request Example**:<br>
`https://[HOST_NAME]/api/search?departure=TPE&arrival=HKG&date=2019-05-20&p=1&t=direct`

- **Success Response Example:**

>
	{
		  status: "success",
		  statusCode: 200,
		  flight: [
		      [
		        {
		          type: "direct",
		          total_duration: 110,
		          totalPrice: 3229,
		          departure_time: 1558337100000,
		          arrival_time: 1558343700000,
		          flight: [
		            {
		              id: 935,
		              flightNo: "CI601",
		              departure_code: "TPE",
		              arrival_code: "HKG",
		              date: "2019-05-20",
		              cabinClass: "Economy",
		              duration_hour: 1,
		              duration_min: 50,
		              duration: 110,
		              departure_time: "07:25",
		              arrival_time: "09:15",
		              airline_code: "CI",
		              airline_name: "中華航空公司",
		              departure_portCode: "TPE",
		              departure_portName: "桃園機場",
		              arrival_portCode: "HKG",
		              arrival_portName: "香港國際機場",
		              tax: 966,
		              fare: 2263,
		              totalPrice: 3229
		            }
		          ]
		        },
		        {
		          type: "direct",
		          total_duration: 115,
		          totalPrice: 3229,
		          departure_time: 1558339800000,
		          arrival_time: 1558346700000,
		          flight: [
		            {
		              id: 936,
		              flightNo: "CI903",
		              departure_code: "TPE",
		              arrival_code: "HKG",
		              date: "2019-05-20",
		              cabinClass: "Economy",
		              duration_hour: 1,
		              duration_min: 55,
		              duration: 115,
		              departure_time: "08:10",
		              arrival_time: "10:05",
		              airline_code: "CI",
		              airline_name: "中華航空公司",
		              departure_portCode: "TPE",
		              departure_portName: "桃園機場",
		              arrival_portCode: "HKG",
		              arrival_portName: "香港國際機場",
		              tax: 966,
		              fare: 2263,
		              totalPrice: 3229
		            }
		          ]
		        },
		        ....
		      ],
		      [
		        {
		          type: "direct",
		          total_duration: 105,
		          totalPrice: 5225,
		          departure_time: 1558332000000,
		          arrival_time: 1558338300000,
		          flight: [
		            {
		              id: 955,
		              flightNo: "CX463",
		              departure_code: "TPE",
		              arrival_code: "HKG",
		              date: "2019-05-20",
		              cabinClass: "Economy",
		              duration_hour: 1,
		              duration_min: 45,
		              duration: 105,
		              departure_time: "06:00",
		              arrival_time: "07:45",
		              airline_code: "CX",
		              airline_name: "國泰航空公司",
		              departure_portCode: "TPE",
		              departure_portName: "桃園機場",
		              arrival_portCode: "HKG",
		              arrival_portName: "香港國際機場",
		              tax: 1021,
		              fare: 4204,
		              totalPrice: 5225
		            }
		          ]
		        },
		        ....
		      ],
		      [
		        {
		          type: "direct",
		          total_duration: 105,
		          totalPrice: 5225,
		          departure_time: 1558332000000,
		          arrival_time: 1558338300000,
		          flight: [
		            {
		              id: 955,
		              flightNo: "CX463",
		              departure_code: "TPE",
		              arrival_code: "HKG",
		              date: "2019-05-20",
		              cabinClass: "Economy",
		              duration_hour: 1,
		              duration_min: 45,
		              duration: 105,
		              departure_time: "06:00",
		              arrival_time: "07:45",
		              airline_code: "CX",
		              airline_name: "國泰航空公司",
		              departure_portCode: "TPE",
		              departure_portName: "桃園機場",
		              arrival_portCode: "HKG",
		              arrival_portName: "香港國際機場",
		              tax: 1021,
		              fare: 4204,
		              totalPrice: 5225
		            }
		          ]
		        },
		        ....
		      ],
		      [
		        {
		          type: "direct",
		          total_duration: 105,
		          totalPrice: 5225,
		          departure_time: 1558332000000,
		          arrival_time: 1558338300000,
		          flight: [
		            {
		              id: 955,
		              flightNo: "CX463",
		              departure_code: "TPE",
		              arrival_code: "HKG",
		              date: "2019-05-20",
		              cabinClass: "Economy",
		              duration_hour: 1,
		              duration_min: 45,
		              duration: 105,
		              departure_time: "06:00",
		              arrival_time: "07:45",
		              airline_code: "CX",
		              airline_name: "國泰航空公司",
		              departure_portCode: "TPE",
		              departure_portName: "桃園機場",
		              arrival_portCode: "HKG",
		              arrival_portName: "香港國際機場",
		              tax: 1021,
		              fare: 4204,
		              totalPrice: 5225
		            }
		          ]
		        },
		        ....
		      ]
		    ]
		  ]
		}

- **Error Response Example:**

>
	{
		statusCode: 404,
		status: 'error',
		flight: '沒有找到相關飛行航班，請調整其他搜索範圍。'
    }
    
## Map API
- **End Point**: `/map`
- **Method**: `GET`
- **Query Parameters**

Field     | Type      | Description     |
--------- | --------- | --------------- |
departure | String    | 本次旅程的出發地   |
arrival   | String    | 本次旅程的目的地   |
date      | String    | 本次旅程的日期     |

- **Request Example**:<br>
`https://[HOST_NAME]/api/search?departure=TPE&arrival=HKG&date=2019-05-20&p=1&t=direct`

- **Success Response Example:**

>
	{
	  statusCode: 200,
	  status: "success",
	  departure_code: "TPE",
	  date: "2019-05-20",
	  map: [
	    {
	    min: 3229,
	    max: 12445,
	    med: 5225,
	    avg: 5156.38,
	    quantity: 50,
	    airportCode: "HKG",
	    airportName: "Hong-Kong"
	    },
	    {
	    min: 7451,
	    max: 13208,
	    med: 9157,
	    avg: 9743.25,
	    quantity: 4,
	    airportCode: "BJS",
	    airportName: "Beijing"
	    },
	    ....
	  ]
	}
		
- **Error Response Example:**

>
	{
		statusCode: 404,
		status: 'error',
		flight: '沒有找到相關飛行航班，請調整其他搜索範圍。'
    }


## Calendar API
- **End Point**: `/calendar `
- **Method**: `GET`
- **Query Parameters**

Field     | Type      | Description     |
--------- | --------- | --------------- |
departure | String    | 本次旅程的出發地   |
arrival   | String    | 本次旅程的目的地   |
date      | String    | 本次旅程的日期     |

- **Request Example**:<br>
`https://[HOST_NAME]/api/calendar?departure=TPE&arrival=HKG&year=2019&month=05`

- **Success Response Example:**

>
	{
		statusCode: 200,
		status: "success",
		year: "2019",
		month: "05",
		week: 3,
		average: 3297.06,
		calendar: [
			{
			  min: 3229,
			  max: 12445,
			  med: 5225,
			  avg: 5573.02,
			  quantity: 50,
			  day: "01"
			},
			{
			  min: 3229,
			  max: 12445,
			  med: 5225,
			  avg: 5350.04,
			  quantity: 52,
			  day: "02"
			},
			....
		]
	}
		
- **Error Response Example:**

>
	{
		statusCode: 404,
		status: 'error',
		flight: '沒有找到相關飛行航班，請調整其他搜索範圍。'
    }

