# SPOT FLIGHT


A price comparison website for flight ticket.<br/>
Website: [https://hhhhhanyi.com](https://hhhhhanyi.com)

## Demo
<img src="https://i.imgur.com/kOd9xLK.gif" width="100%">

## Technologies
### Backend
-  **Web Crawler**：
	-  使用 Request module 爬取機票價格資料
	-  24 小時不間斷爬蟲，間隔時間 30-50 秒
	-  利用多組 User-Agent、Cookie (UserId) 爬取資料
	-  Error 處理：error.log、E-mail 提醒、1 小時後重啟

-  **AWS EC2**：使用 EC2 架設 HTTPs、MySQL、Redis 伺服器。
-  **Data Access Object**: 使用 DAO 設計模式。
-  **MySQL Transaction**: 使用 Transaction 達成資料的一致性。
-  **SSL Certificate**: Let's Encrypt SLL 憑證申請與安裝。
-  **RESTful API**
	> SEARCH (POST)：接收使用者輸入資料，並立即爬取最新資料。<br/>
	SEARCH (GET)：從資料庫讀取當日機票價格。<br/>
	CALENDAR (GET)：從資料庫讀取當月機票價格。<br/>
	MAP (GET)：從資料庫讀取使用者選擇出發地到其他地的機票價格。<br/>

-  **Error Handling**:
	> ERROR Log：API.log、SQL.log、REQUEST.log、ERROR.log<br/>
	E-mail 提醒：爬蟲 Request 目標網站 API 出錯時 Email 提醒。
	
-  **Unit Test**: 使用 Mocha 進行兩項單元測試。
	> API：使用 Chai Assert Library 驗證 API 執行結果是否符合預期。<br/>
	Function：驗證 Function 是否可接受不同格式資料輸入。<br/>

### Front-End
- **Bootstrap**: 使用 Bootstrap 設計 RWD 頁面。
- **Fetch**: 使用 Fetch 發送 Request。
- **Google Chart API**: 使用 Google Chart API 繪製圖表。

	
## Backend Architecture
![img](https://i.imgur.com/QtmOnho.png)

## Tech Stack
- AWS EC2
- Node.js / Express
- MySQL
- NGINX
- HTML
- CSS
- JavaScript
- Bootstrap
