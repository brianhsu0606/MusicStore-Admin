# Music Store Admin 後台管理系統

這是一套樂器行的後台管理系統，具備會員管理、商品管理、訂單處理與營收統計等功能，採用 Vue 3 + Express 開發，支援 RWD 響應式設計。

## 使用技術

### 前端（Vue 3）
- Vue 3 + Composition API
- Vue Router
- Pinia（狀態管理）
- Element Plus（UI 元件庫）
- Tailwind CSS（RWD 響應式設計）
- Axios（API 串接）

### 後端（Node.js + Express）
- RESTful API 設計
- JWT 驗證機制
- Mongoose + MongoDB（資料儲存）


**以下是作品畫面**

首頁：快速讀取最新進貨狀況、庫存狀況、基本資訊、近30天的訂天的訂單數量
![image](https://github.com/brianhsu0606/music-store-admin/blob/main/images/home.jpg)

網路訂單：在每日營收、商品庫存、網路訂單、會員管理，都有著CRUD及基本的表格介面
![image](https://github.com/brianhsu0606/music-store-admin/blob/main/images/order.jpg)

營收分析：此頁面只有管理員或超級管理員可以進入，可以看到成本及營業額的表格、分析
![image](https://github.com/brianhsu0606/music-store-admin/blob/main/images/finance.jpg)

同時也做了全站的RWD設計，在手機上也不會跑版
![image](https://github.com/brianhsu0606/music-store-admin/blob/main/images/home_mobile.jpg)
![image](https://github.com/brianhsu0606/music-store-admin/blob/main/images/order_mobile.jpg)
![image](https://github.com/brianhsu0606/music-store-admin/blob/main/images/finance_mobile.jpg)
images/finance_mobile.jpg

同時也做了全站的 RWD 設計，在手機上也不會跑版。

<!-- 手機版首頁截圖 -->
<img src="images/home_mobile.jpg" alt="手機版首頁截圖" width="350">

<!-- 手機版訂單頁面截圖 -->
<img src="images/order_mobile.jpg" alt="手機版訂單頁面截圖" width="350">

<!-- 手機版營業額頁面截圖 -->
<img src="images/finance_mobile.jpg" alt="手機版營業額頁面截圖" width="350">
