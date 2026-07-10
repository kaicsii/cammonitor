(function () {
    // 依「目前可用攝影機數量」自動套用版面。所有版面皆為 3 欄 x 3 列（每格 640x360 = 16:9）的
    // 網格，主程式只需切換 grid-template-areas 即可重新排列，衛星雲圖區(sat)永遠保留、不留空白。
    //
    //  5 支：主(2x2) + 4 小，全部 16:9；雲圖右下 640x360
    //  4 支：主(2x2) + 2 小(16:9) + 1 寬；   雲圖右下 640x360
    //  3 支：主(2x2) + 1 直 + 1 寬；          雲圖右下 640x360
    //  2 支：主(16:9 滿寬) + 1 寬；           雲圖右下 640x360
    //  1 支：單一 16:9 滿寬；                 雲圖改為底部整條 1920x360
    var LAYOUTS = {
        1: '"c1 c1 c1" "c1 c1 c1" "sat sat sat"',
        2: '"c1 c1 c1" "c1 c1 c1" "c2 c2 sat"',
        3: '"c1 c1 c2" "c1 c1 c2" "c3 c3 sat"',
        4: '"c1 c1 c2" "c1 c1 c3" "c4 c4 sat"',
        5: '"c1 c1 c2" "c1 c1 c3" "c4 c5 sat"'
    };

    var MAX = 5,
        wall = document.getElementById('wall'),
        noiseCls = (data.noise === 1) ? ' show-noise' : '',
        params = [],
        cams, n, i, frag;

    // 1) 篩選有訊號的攝影機（online !== false 且有 id）
    cams = (data.cameras || []).filter(function (c) {
        return c && c.id && c.online !== false;
    });

    // 版面上限 5 支，超出僅顯示前 5 支
    if (cams.length > MAX) {
        console.warn('可用攝影機 ' + cams.length + ' 支，超過版面上限 ' + MAX +
            ' 支，僅顯示前 ' + MAX + ' 支。');
        cams = cams.slice(0, MAX);
    }
    n = cams.length;

    // 2) 播放參數
    params.push('controls=' + (data.controls === 1 ? 1 : 0));
    if (data.autoplay === 1) {
        params.push('autoplay=1');
        params.push('mute=1'); // 未靜音無法自動播放（監控牆本就適合靜音）
    }

    // 3) 無可用攝影機：整片保留給衛星雲圖區
    if (n === 0) {
        wall.style.gridTemplateAreas = '"sat sat sat" "sat sat sat" "sat sat sat"';
        wall.insertAdjacentHTML('beforeend',
            '<div class="sat"><span>目前無可用攝影機訊號<br>' +
            '<small>氣象衛星雲圖 · OBS 疊圖定位區</small></span></div>');
        return;
    }

    // 4) 套用對應版面並依序渲染攝影機（cams[0] = 主畫面 c1）
    wall.style.gridTemplateAreas = LAYOUTS[n];

    frag = '';
    for (i = 0; i < n; i++) {
        var cam = cams[i],
            area = 'c' + (i + 1),
            title = cam.title || '',
            frame = '<iframe src="https://www.youtube.com/embed/' + cam.id + '?' + params.join('&') +
                '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        frag += '<div class="col' + noiseCls + '" style="grid-area:' + area + '" data-loc="' + title + '">' +
            frame + '</div>';
    }

    // 衛星雲圖：固定保留的 OBS 疊圖定位區
    frag += '<div class="sat"><span>氣象衛星雲圖<br><small>OBS 疊圖定位區</small></span></div>';

    wall.insertAdjacentHTML('beforeend', frag);
})();
