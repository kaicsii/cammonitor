(function () {
    'use strict';

    var MAX_CAMS = 10;
    // 1920×1080 的 4×4 網格；第一支為 2×2 主畫面，最後三格保留給 OBS。
    var CAMERA_CELLS = [[1,1,2,2],[3,1,1,1],[4,1,1,1],[3,2,1,1],[4,2,1,1],
                        [1,3,1,1],[2,3,1,1],[3,3,1,1],[4,3,1,1],[1,4,1,1]];

    // ---- 讀取設定並篩選「有訊號」的攝影機 ----
    var cfg = (typeof data !== 'undefined') ? data : { items: [] },
        available = (cfg.items || []).filter(function (it) {
            return it && it.id && it.enabled !== false;   // 未填 enabled 視為啟用
        });

    if (available.length > MAX_CAMS) {
        console.warn('可用攝影機超過 ' + MAX_CAMS + ' 支，僅顯示前 ' + MAX_CAMS + ' 支。');
        available = available.slice(0, MAX_CAMS);
    }

    // ---- 組合 YouTube 參數 ----
    var params = [];
    if (cfg.controls < 1) { params.push('controls=0'); }
    if (cfg.autoplay === 1) { params.push('autoplay=1'); }

    function buildIframe(item) {
        var src = 'https://www.youtube.com/embed/' + item.id +
                  (params.length ? '?' + params.join('&') : '');
        return '<iframe src="' + src + '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen></iframe>';
    }

    // ---- 產生攝影機格子 ----
    function buildCameras() {
        var cellsHtml = '',
            i, c, item, style;

        for (i = 0; i < available.length; i++) {
            c = CAMERA_CELLS[i];
            item = available[i];
            style = 'grid-column:' + c[0] + ' / span ' + c[2] + ';' +
                    'grid-row:' + c[1] + ' / span ' + c[3] + ';';
            cellsHtml += '<div class="col" style="' + style + '" data-loc="' +
                         (item.title || '') + '">' + buildIframe(item) + '</div>';
        }

        return cellsHtml;
    }

    // ---- 第四列最後三格：OBS 疊圖預留區 ----
    var obsHtml =
        '<div class="obs-box" id="satellite" style="grid-column:2;grid-row:4"><span>氣象衛星雲圖<br><small>OBS 疊圖區</small></span></div>' +
        '<div class="obs-box" id="title" style="grid-column:3;grid-row:4"><span>標題<br><small>OBS 疊圖區</small></span></div>' +
        '<div class="obs-box" id="subtitle" style="grid-column:4;grid-row:4"><span>副標題／其他<br><small>OBS 疊圖區</small></span></div>';

    var wall = '<div class="wall">' + buildCameras() + obsHtml + '</div>';
    document.body.insertAdjacentHTML('afterbegin', wall);
})();
