(function () {
    // YouTube 播放參數
    var params = [];
    params.push('controls=' + (data.controls === 1 ? 1 : 0));
    if (data.autoplay === 1) {
        params.push('autoplay=1');
        params.push('mute=1'); // 瀏覽器與 OBS 需靜音才允許自動播放；要聲音的話移除這行（但需手動點播）
    }

    var noiseCls = data.noise === 1 ? ' show-noise' : '';

    // 篩選有訊號的攝影機項目，最多支援 6 個
    var activeItems = (data.items || []).filter(function (item) {
        return item && item.enabled !== false;
    });

    var count = activeItems.length;
    if (count > 6) { count = 6; }
    if (count < 1) { count = 1; } // 至少保留一個畫面（顯示無訊號提示）

    // 版面插槽：依據目前數量動態裁切插槽陣列
    var slots = ['main', 's1', 's2', 's3', 's4', 's5'].slice(0, count);

    var stage = document.createElement('div');
    stage.className = 'stage stage--count-' + count;

    slots.forEach(function (slot, idx) {
        var item = activeItems.length > idx ? activeItems[idx] : null;
        var cell = document.createElement('div');
        cell.className = 'cell cell--' + slot + noiseCls;

        if (item) {
            var badge = document.createElement('div');
            badge.className = 'badge';
            badge.textContent = String(idx + 1);
            if (item.bgColor) { badge.style.backgroundColor = item.bgColor; }
            if (item.color) { badge.style.color = item.color; }
            cell.appendChild(badge);

            var loc = document.createElement('div');
            loc.className = 'loc';
            loc.textContent = item.title || '';
            cell.appendChild(loc);

            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube.com/embed/' + item.id + '?' + params.join('&');
            iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            cell.appendChild(iframe);
        } else {
            // 無鏡頭可用時的防錯預設畫面
            var badge = document.createElement('div');
            badge.className = 'badge';
            badge.textContent = String(idx + 1);
            cell.appendChild(badge);

            var loc = document.createElement('div');
            loc.className = 'loc';
            loc.textContent = '無可用攝影機訊號';
            cell.appendChild(loc);

            if (!cell.className.match(/\bshow-noise\b/)) {
                cell.className += ' show-noise';
            }
        }

        stage.appendChild(cell);
    });

    // 衛星雲圖保留區（實際影像於 OBS 疊上）
    var sat = document.createElement('div');
    sat.className = 'cell cell--sat';
    var satLabel = document.createElement('div');
    satLabel.className = 'sat-label';
    satLabel.innerHTML = '颱風衛星雲圖<span>OBS 疊圖區</span>';
    sat.appendChild(satLabel);
    stage.appendChild(sat);

    document.body.appendChild(stage);
})();
