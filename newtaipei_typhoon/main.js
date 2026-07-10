(function () {
    // 版面固定為：1 個主畫面 + 4 個次畫面 + 1 個衛星雲圖定位區。
    // 攝影機依 data.items 順序對應：[0]=主畫面（左上 2x2）、[1..4]=其餘四格（第 6 個以後不顯示）。
    var wall = document.getElementById('wall'),
        slots = ['main', 'c2', 'c3', 'c4', 'c5'],
        params = [],
        noiseCls = (data.noise === 1) ? ' show-noise' : '',
        frag = '';

    params.push('controls=' + (data.controls === 1 ? 1 : 0));
    if (data.autoplay === 1) {
        params.push('autoplay=1');
        params.push('mute=1'); // 瀏覽器自動播放政策：未靜音無法 autoplay（監控牆本就適合靜音）
    }

    slots.forEach(function (area, idx) {
        var item = data.items[idx] || null,
            title = '',
            frame = '';

        if (item) {
            title = item.title || '';
            frame = '<iframe src="https://www.youtube.com/embed/' + item.id + '?' + params.join('&') +
                '" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
        }

        frag += '<div class="col' + noiseCls + '" style="grid-area:' + area + '" data-loc="' + title + '">' +
            frame + '</div>';
    });

    // 衛星雲圖：透明定位區，供 OBS 疊上圖片／瀏覽器來源時對齊
    frag += '<div class="sat"><span>氣象衛星雲圖<br><small>OBS 疊圖定位區</small></span></div>';

    wall.insertAdjacentHTML('beforeend', frag);
})();
