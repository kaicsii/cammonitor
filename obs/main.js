(function() {
    var addRule = (function(style){
        var sheet = document.head.appendChild(style).sheet;
        return function(selector, css){
            var propText = Object.keys(css).map(function(p){
                return p+":"+css[p]
            }).join(";");
            sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
        }
    })(document.createElement("style"));

    var $body = document.body,
        total = data.items.length,
        html = '',
        frame = '',
        title,
        color,
        bgColor,
        extraCls = ' ',
        n = 1,
        tpl = '<div id="monitor-{number}" class="col col-{col} {extraCls}" data-loc="{title}">{iframe}</div>',
        params = [],
        item,
        prePageAmount = 16;
        
    if (total <= 9)  {
        prePageAmount = 9;
    }

    if (total <= 6)  {
        prePageAmount = 6;
    }

    if (total <= 4) {
        prePageAmount = 4;
    }

    if (data.controls < 1) {
        params.push('controls=1');
    }

    if (data.autoplay === 1) {
        params.push('autoplay=1');
    }

    if (data.noise === 1) {
        extraCls += 'show-noise ';
    }
    
    for(var i =prePageAmount; i>=1 ; i--) {
        title = '';
        color = 'black';
        bgColor = 'yellow';
        item = data.items.length >= i? data.items[i-1]: null;
        if (item === null) {
            frame = '';
        }
        else {     

            if (item.hasOwnProperty('title')) {
                title = item.title || '';
            }
            
            if (item.hasOwnProperty('bgColor')) {
                bgColor = item.bgColor || 'yellow';
            }
            if (item.hasOwnProperty('color')) {
                color = item.color || 'yellow';
            }

            frame =  '<iframe src="https://www.youtube.com/embed/{id}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen></iframe>'
                .replace('{id}', item.id.concat('?', params.join('&')));
        }

        html = tpl.replace('{col}', prePageAmount.toString())
                .replace('{number}', n.toString())
                .replace('{extraCls}', extraCls)
                .replace('{title}', title)
                .replace('{iframe}', frame);

        $body.insertAdjacentHTML('afterbegin', html);
        
        if (bgColor !== 'yellow' || color !== 'black') {
            addRule('#monitor-' + n.toString() + ':before', {
                'background-color': bgColor,
                'color': color
            });
        }

        n++;
    }
})();

