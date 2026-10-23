/* =========================================================================
 *  攝影機資料設定檔  data.js
 *  -------------------------------------------------------------------------
 *  只要修改這個檔案即可，不需要動 HTML / CSS / main.js。
 *
 *  ● 停用某支攝影機（失去訊號時）：把該支的 enabled 改成 false
 *  ● 恢復：改回 true（或直接刪掉 enabled 這一行，預設就是啟用）
 *
 *  系統會自動：
 *    1. 篩選出 enabled 為 true 的攝影機
 *    2. 依清單順序填入固定的 4×4 版面（後面的攝影機自動往前補位）
 *
 *  註：清單中第 1 支「啟用」的攝影機會被當成主畫面（2×2 大格）。
 *      版面位置固定，停用幾支，最後面就會空出幾格（顯示黑色）。
 *      最下排右側三格固定保留給 OBS 疊圖，不放攝影機。
 *      若可用數量超過 10 支，只會顯示前 10 支。
 * ========================================================================= */

var data = {
    // ---- 全域設定 ----
    "autoplay": 1,   // 1 = 自動播放
    "controls": 1,   // 0 = 隱藏 YouTube 控制列，1 = 顯示

    // ---- 攝影機清單 ----
    "items": [
        { "enabled": true, "id": "dQ7Sd6PGLdA", "title": "三仙台風景區" },
        { "enabled": true, "id": "JhQuR77AR7U", "title": "都歷遊客中心" },
        { "enabled": true, "id": "AKl3F6cAY2Q", "title": "加路蘭遊憩區" },
        { "enabled": true, "id": "mXnigLvIL0Q", "title": "石梯坪風景區" },
        { "enabled": true, "id": "JkoXcXI04Qk", "title": "大石鼻山" },
        { "enabled": true, "id": "ZdqHgQwvZOw", "title": "金樽遊憩區" },
        { "enabled": true, "id": "JnD8Rk3o0BM", "title": "長虹橋" },
        { "enabled": true, "id": "wTHhv7M0vCI", "title": "綠島南寮漁港" },
        { "enabled": true, "id": "a8nJQr5rBGs", "title": "綠島柴口" },
        { "enabled": true, "id": "fv1yFousBvc", "title": "綠島帆船鼻" }
    ]
};
