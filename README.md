# Music Store Admin 後台管理系統

本專案為一套樂器行的後台管理系統，具備會員管理、商品管理、訂單處理與營收統計等功能。  
前後端採用 Vue 3 與 Express 開發，並支援 RWD 響應式設計，適用於桌機與手機操作。

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

## 系統功能介紹

- 首頁儀表板：快速瀏覽庫存狀況、近期訂單與進貨資訊
- 會員管理：建立、編輯、刪除會員資料
- 商品管理：管理商品資訊與庫存數量
- 訂單處理：查看並更新顧客訂單
- 營收分析：僅限管理員權限，查看每月成本與營業額報表
  
## 系統畫面預覽（桌機版）

### 首頁：快速讀取最新進貨狀況、庫存狀況、基本資訊、近30天的訂天的訂單數量
<img src="images/home.jpg" alt="首頁截圖">

### 每日營收、商品庫存、網路訂單、會員管理：有基本的資料表格及CRUD操作功能
<img src="images/order.jpg" alt="訂單截圖">

### 營收分析（限管理員）：顯示成本與營收的統計圖表，提供數據分析功能 
<img src="images/finance.jpg" alt="營收分析截圖">

## RWD 響應式設計（手機版預覽）
<div style="display: flex; justify-content: space-around; align-items: flex-start; flex-wrap: wrap;">
  <img src="images/home_mobile.jpg" alt="手機版首頁截圖" width="260" height="600">
  <img src="images/order_mobile.jpg" alt="手機版訂單頁面截圖" width="260" height="600">
  <img src="images/finance_mobile.jpg" alt="手機版營業額頁面截圖" width="260" height="600">
</div>
