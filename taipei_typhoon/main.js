(function () {
    // YouTube 播放參數
    var params = [];
    params.push('controls=' + (data.controls === 1 ? 1 : 0));
    if (data.autoplay === 1) {
        params.push('autoplay=1');
        params.push('mute=1'); // 瀏覽器與 OBS 需靜音才允許自動播放；要聲音的話移除這行（但需手動點播）
    }

    var noiseCls = data.noise === 1 ? ' show-noise' : '';

    // 版面插槽：data.items[0] 為主畫面，其餘 5 個為次要畫面
    var slots = ['main', 's1', 's2', 's3', 's4', 's5'];

    var stage = document.createElement('div');
    stage.className = 'stage';

    slots.forEach(function (slot, idx) {
        var item = data.items && data.items.length > idx ? data.items[idx] : null;
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
