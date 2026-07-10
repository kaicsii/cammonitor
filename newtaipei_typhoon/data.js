/*
 * 攝影機與播放設定集中管理檔。
 *
 * 使用方式：
 *   - 只要把某支攝影機的 online 改成 false（或移除該支），畫面就會自動略過它、
 *     重新計算數量並套用對應版面，不需要改動 HTML / CSS / main.js。
 *   - 顯示優先序 = 陣列由上而下。第一支 online 的攝影機為「主畫面」。
 *   - 畫面最多同時顯示 5 支（1 主 + 4 次）＋ 1 個固定的衛星雲圖保留區；
 *     若 online 的攝影機超過 5 支，僅顯示前 5 支。
 *
 * 全域設定：
 *   noise    : 1 = 疊上訊號雜訊底圖(noise1.gif)，0 = 關閉
 *   autoplay : 1 = 自動播放(自動靜音，瀏覽器政策所需)
 *   controls : 1 = 顯示 YouTube 控制列，0 = 隱藏
 */
var data = {
    noise: 1,
    autoplay: 1,
    controls: 0,

    cameras: [
        { id: "xwAWSh35uuw", title: "新北淡水漁人碼頭", online: true },
        { id: "xxMRjVwCQ3o", title: "新北烘爐地",       online: true },
        { id: "XSD5ptYisw8", title: "新北九份",         online: true },
        { id: "HirBQsQEUeA", title: "新北十分瀑布",     online: true },
        { id: "di-4DCblWq4", title: "新北八里左岸",     online: true }
    ]
};
