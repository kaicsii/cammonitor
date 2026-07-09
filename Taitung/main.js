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

    // ---- 篩選在線 (enabled !== false) 的攝影機 ----
    var onlineItems = items.filter(function (item) {
        return item.enabled !== false;
    });
    var count = onlineItems.length;

    // ---- 找出主畫面攝影機與次要畫面攝影機 ----
    var mainItem = null;
    var secondaries = [];
    if (count > 0) {
        var originalMainIdx = typeof d.main === 'number' ? d.main : 0;
        var configuredMainItem = items[originalMainIdx];
        
        // 如果設定的主畫面攝影機目前在線，則設為主畫面；否則以第一個在線的攝影機作為主畫面
        if (configuredMainItem && onlineItems.indexOf(configuredMainItem) !== -1) {
            mainItem = configuredMainItem;
        } else {
            mainItem = onlineItems[0];
        }
        
        // 剩餘的在線攝影機為次要畫面
        secondaries = onlineItems.filter(function (item) {
            return item !== mainItem;
        });
    }

    // ---- 各攝影機數量的版面配置 ----
    // 格式: [row-start, col-start, row-span, col-span]
    var LAYOUTS = {
        0: {
            cols: 2, rows: 1,
            main: null, secondaries: [],
            satellite: [1, 1, 1, 1], clock: [1, 2, 1, 1]
        },
        1: {
            cols: 2, rows: 2,
            main: [1, 1, 1, 2], secondaries: [],
            satellite: [2, 1, 1, 1], clock: [2, 2, 1, 1]
        },
        2: {
            cols: 2, rows: 2,
            main: [1, 1, 1, 1], secondaries: [[1, 2, 1, 1]],
            satellite: [2, 1, 1, 1], clock: [2, 2, 1, 1]
        },
        3: {
            cols: 3, rows: 2,
            main: [1, 1, 1, 2], secondaries: [[1, 3, 1, 1], [2, 1, 1, 1]],
            satellite: [2, 2, 1, 1], clock: [2, 3, 1, 1]
        },
        4: {
            cols: 3, rows: 3,
            main: [1, 1, 2, 2], secondaries: [[1, 3, 1, 1], [2, 3, 1, 1], [3, 1, 1, 1]],
            satellite: [3, 2, 1, 1], clock: [3, 3, 1, 1]
        },
        5: {
            cols: 4, rows: 3,
            main: [1, 1, 2, 2], secondaries: [[1, 3, 1, 1], [1, 4, 1, 1], [2, 3, 1, 1], [2, 4, 1, 1]],
            satellite: [3, 1, 1, 3], clock: [3, 4, 1, 1]
        },
        6: {
            cols: 4, rows: 3,
            main: [1, 1, 2, 2], secondaries: [[1, 3, 1, 1], [1, 4, 1, 1], [2, 3, 1, 1], [2, 4, 1, 1], [3, 1, 1, 1]],
            satellite: [3, 2, 1, 2], clock: [3, 4, 1, 1]
        },
        7: {
            cols: 4, rows: 4,
            main: [1, 1, 2, 2],
            secondaries: [
                [1, 3, 2, 2], // 次要 1 放大為 2x2
                [3, 1, 1, 1], [3, 2, 1, 1], [3, 3, 1, 1], [3, 4, 1, 1],
                [4, 1, 1, 1]
            ],
            satellite: [4, 2, 1, 2], clock: [4, 4, 1, 1]
        },
        8: {
            cols: 4, rows: 4,
            main: [1, 1, 2, 2],
            secondaries: [
                [1, 3, 1, 1], [1, 4, 1, 1], [2, 3, 1, 1], [2, 4, 1, 1],
                [3, 1, 1, 1], [3, 2, 1, 1],
                [4, 1, 1, 1]
            ],
            satellite: [3, 3, 2, 2], clock: [4, 2, 1, 1]
        },
        9: {
            cols: 4, rows: 4,
            main: [1, 1, 2, 2],
            secondaries: [
                [1, 3, 1, 1], [1, 4, 1, 1], [2, 3, 1, 1], [2, 4, 1, 1],
                [3, 1, 1, 1], [3, 2, 1, 1], [3, 3, 1, 1], [3, 4, 1, 1]
            ],
            satellite: [4, 1, 1, 3], clock: [4, 4, 1, 1]
        },
        10: {
            cols: 4, rows: 4,
            main: [1, 1, 2, 2],
            secondaries: [
                [1, 3, 1, 1], [1, 4, 1, 1], [2, 3, 1, 1], [2, 4, 1, 1],
                [3, 1, 1, 1], [3, 2, 1, 1], [3, 3, 1, 1], [3, 4, 1, 1],
                [4, 1, 1, 1]
            ],
            satellite: [4, 2, 1, 2], clock: [4, 4, 1, 1]
        }
    };

    // 取得對應數量的版面配置，若大於 10 則套用 10 的配置，小於 0 則套用 0 的配置
    var layout = LAYOUTS[count] || (count > 10 ? LAYOUTS[10] : LAYOUTS[0]);

    // 動態設定 stage 的 CSS Grid 列數與欄數
    stage.style.gridTemplateColumns = 'repeat(' + layout.cols + ', 1fr)';
    stage.style.gridTemplateRows = 'repeat(' + layout.rows + ', 1fr)';

    function place(el, pos) {
        if (!pos) return;
        var row = pos[0], col = pos[1], rowSpan = pos[2], colSpan = pos[3];
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

    // 繪製主畫面 (編號 1)
    if (layout.main && mainItem) {
        var mainCell = videoCell(mainItem, 1, true);
        place(mainCell, layout.main);
        stage.appendChild(mainCell);
    }

    // 繪製次要影像 (編號 2 起算)
    secondaries.slice(0, layout.secondaries.length).forEach(function (item, i) {
        var cell = videoCell(item, i + 2, false);
        place(cell, layout.secondaries[i]);
        stage.appendChild(cell);
    });

    // ---- 衛星雲圖保留區 ----
    var satCell = document.createElement('div');
    satCell.className = 'cell';
    place(satCell, layout.satellite);
    stage.appendChild(satCell);

    // ---- 時鐘 ----
    var clockCell = document.createElement('div');
    clockCell.className = 'cell info clock';
    var timeEl = document.createElement('div');
    timeEl.className = 'time';
    var dateEl = document.createElement('div');
    dateEl.className = 'date';
    clockCell.appendChild(timeEl);
    clockCell.appendChild(dateEl);
    place(clockCell, layout.clock);
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
