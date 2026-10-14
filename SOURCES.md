# 新加坡版資料、方位與建模說明

整理日期：2026-10-14。

## 已核實

- Ticketmaster 與 Live Nation：2026 年 12 月 17、19、20、22 日，19:00，National Stadium。票價 VIP S$388，CAT1–6 分別 S$328、288、238、208、168、148，另有訂票費。
  https://www1.ticketmaster.sg/activity/detail/26sg_bts
  https://www.livenation.sg/event/bts-world-tour-arirang-in-singapore-singapore-tickets-edp1675139
- 場館 The Kallang 的 BTS 活動頁提供官方座位圖。本次已下載核對，其分區及羅盤與使用者截圖一致。官方圖註明不按比例繪製且配置可變動。
  https://www.thekallang.com.sg/en/things-to-do/events/bts-world-tour--arirang--in-singapore.html
- 官方座位圖：
  https://asset.thekallang.com.sg/adobe/assets/urn%3Aaaid%3Aaem%3Afd4a842f-7eec-4cb3-bc26-83ba1191bc70/as/asset.png
  Ticketmaster 同場圖：
  https://static.ticketmaster.sg/images/activity/field/26sg_bts_0876bf8a9dcf548dda597b4554191e29.jpg
- 場館官方資料：National Stadium 約 55,000 人容量，具可開合屋頂、無柱大跨度穹頂及觀眾席冷卻系統。這是場館容量，不是此演出可售票數。本版不是 Singapore Indoor Stadium，也不是已拆除的舊 National Stadium。
  https://www.thekallang.com.sg/en/plan-your-visit/venues-and-amenities/national-stadium.html

## 這一站的方位

官方平面圖為北在上、東在右、南在下、西在左。

| 方位 | 內場 |
| --- | --- |
| 北 N | PA1–PA14 |
| 東 E | PB1–PB13 |
| 南 S | PC1–PC14 |
| 西 W | PD1–PD13 |

官方圖另標出西區可能受天氣影響，東西兩側各有兩個 FOH 控台。本模型保留這些相對位置，控台大小、高度與遮擋為估算。圖上的地理方位不能自動等同於藝人的主表演正面。

看台共 122 個圖示分區：1XX 共 50 區（含 107A/B、119A/B、132A/B、144A/B），405–446 共 42 區；606–620 與 631–645 共 30 區。未把圖上沒有的號碼自行補成座位區。內場共 54 區。

## 走位鏡像

依使用者要求，以先前 @minnn_f 走位參考圖為源資料，沿南北軸做左右鏡像：西北 ↔ 東北，西南 ↔ 東南。來源歌曲分配保留不動，由場館轉換層映射成新加坡位置。北／南、座位區號、羅盤以及選中的座位不鏡像。

3D 與平面圖共用同一份轉換結果；花道斜率則按新加坡圖作示意調整。年齡排序仍為 1 Jin、2 SUGA、3 j-hope、4 RM、5 Jimin、6 V、7 Jung Kook。

例如 FYA：舊圖前左的 5，轉到新加坡東南；舊圖前右的 1、2，轉到新加坡西南。FAKE LOVE 的兩組位置仍是參考分組，非已核實時間軸。

本次沒有查到官方公布的新加坡逐曲走位或「應鏡像」的確認；鏡像是使用者指定的參考呈現，頁面有明示。另查到 Moon 的巡演走位整理注明 10 月 3 日後有變動，故沒有將任何早期圖宣稱為本場最終安排。
https://note.com/_love_myself_/n/n1c64da2f4981

## 座位精度

沒有找到能可靠對應本場所有「區＋排＋座號」的公開逐座資料。本版依官方分區圖生成每排座位，數字模擬排不是票面字母排。靠近花道採約 10 排，其餘內場約 18 排；避開中央台、花道及小舞台後，部分小區會減少可用模擬排。座號遵照先前要求，面向舞台時由左至右增加。

看台各區幾何、排數、高度、座位間距，以及舞台、吊掛屏幕、屋頂，全部為概念估算。不能用此模型保證真實視線、遮擋或離藝人距離。程式小人沿用奶油白造型，不播放歌曲。

## 補充檢索

- A View From My Seat 有 National Stadium 各看台區的觀眾照片，可理解視角；其他演出舞台不同，不能當成這場的實測結果。
  https://www.aviewfrommyseat.com/venue/SINGAPORE%2BNATIONAL%2BSTADIUM/sections/
- 查到舊田徑活動座位分配 PDF，部分區域列字母排及號碼。該檔不是這場 BTS，不能據此聲稱逐座還原，因此未導入。
  https://s3-ap-southeast-1.amazonaws.com/moe-nsg/seat-allocation.pdf
- 二手票頁與討論串出現內場數字排、看台字母排，以及對編號方向的不同說法；不把轉售資訊當官方排號庫。
- 本版未使用高雄／香港的方位或看台座標；共用的只有既有介面、人物風格和來源歌曲資料。

## 驗證

自動檢查包含：176 個分區皆有可選座位、座位識別唯一、內場方位正確、所有歌曲成員符合左右鏡像、估算座位不落在中央台／花道／小舞台、座號左右順序，以及非法分享參數處理。
