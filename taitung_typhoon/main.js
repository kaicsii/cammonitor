(function () {
    var d = window.data || {};
    var items = d.items || [];
    var stage = document.getElementById('stage');
    if (d.showNumber === false) { stage.classList.add('hide-num'); }

    // ---- YouTube 參數 ----
    var params = [];
    if (d.controls < 1) { params.push('controls=1'); }   // 沿用原本邏輯,不更動
    if (d.autoplay === 1) { params.push('autoplay=1'); params.push('mute=1'); } // 自動播放必須靜音才會生效
    params.push('playsinline=1');
    params.push('rel=0');
    var query = params.join('&');

    var noiseCls = d.noise === 1 ? ' show-noise' : '';

    // ---- 主畫面 / 次要影像 ----
    var mainIdx = typeof d.main === 'number' ? d.main : 0;
    var mainItem = items[mainIdx] || null;
    var secondaries = items.filter(function (_, i) { return i !== mainIdx; });

    // 每格在 4×4 grid 的位置: [row-start, col-start, row-span, col-span]
    // 主畫面 2×2;其餘依「右上 4 格 → 第三列 4 格 → 第四列」排列
    var SEC_POS = [
        [1, 3], [1, 4], [2, 3], [2, 4],   // 次 1~4:右上
        [3, 1], [3, 2], [3, 3], [3, 4],   // 次 5~8:第三列
        [4, 1]                            // 次 9:第四列最左
    ];

    function place(el, row, col, rowSpan, colSpan) {
        el.style.gridArea =
            row + ' / ' + col + ' / ' +
            (row + (rowSpan || 1)) + ' / ' + (col + (colSpan || 1));
    }

    function videoCell(item, num, isMain) {
        var cell = document.createElement('div');
        cell.className = 'cell video' + (isMain ? ' main' : '') + noiseCls;
        if (item) {
            cell.setAttribute('data-num', num);
            cell.setAttribute('data-loc', item.title || '');
            if (item.bgColor) { cell.style.setProperty('--badge-bg', item.bgColor); }
            if (item.color) { cell.style.setProperty('--badge-fg', item.color); }

            var f = document.createElement('iframe');
            f.src = 'https://www.youtube.com/embed/' + item.id + '?' + query;
            f.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
            f.setAttribute('allowfullscreen', '');
            cell.appendChild(f);
        }
        return cell;
    }

    // 主畫面(編號 1)
    var mainCell = videoCell(mainItem, 1, true);
    place(mainCell, 1, 1, 2, 2);
    stage.appendChild(mainCell);

    // 9 路次要(編號 2~10)
    secondaries.slice(0, SEC_POS.length).forEach(function (item, i) {
        var cell = videoCell(item, i + 2, false);
        place(cell, SEC_POS[i][0], SEC_POS[i][1], 1, 1);
        stage.appendChild(cell);
    });

    // ---- 空白格(第四列第 2、3 格)----
    // 留黑供 OBS 疊加 QPEPlus 衛星雲圖網頁
    [ [4, 2], [4, 3] ].forEach(function (pos) {
        var blank = document.createElement('div');
        blank.className = 'cell';
        place(blank, pos[0], pos[1], 1, 1);
        stage.appendChild(blank);
    });

    // ---- 時鐘(第四列第 4 格)----
    var clockCell = document.createElement('div');
    clockCell.className = 'cell info clock';
    var timeEl = document.createElement('div');
    timeEl.className = 'time';
    var dateEl = document.createElement('div');
    dateEl.className = 'date';
    clockCell.appendChild(timeEl);
    clockCell.appendChild(dateEl);
    place(clockCell, 4, 4, 1, 1);
    stage.appendChild(clockCell);

    var WEEK = ['日', '一', '二', '三', '四', '五', '六'];
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
        var t = new Date();
        timeEl.textContent = pad(t.getHours()) + ':' + pad(t.getMinutes()) + ':' + pad(t.getSeconds());
        dateEl.textContent = t.getFullYear() + '/' + pad(t.getMonth() + 1) + '/' + pad(t.getDate())
            + ' (' + WEEK[t.getDay()] + ')';
    }
    tick();
    setInterval(tick, 1000);
})();
