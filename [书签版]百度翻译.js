(function() {
    function jsonpGet(url, fun) {
        var tempcallback = 'callback_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2);
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = url + (url.match(/\?/) ? '&' : '?') + 'callback=' + tempcallback;
        document.body.appendChild(oScript);

        window[tempcallback] = function(json) {
            window[tempcallback] = null;
            document.body.removeChild(oScript);
            fun && fun(json);
        };
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function translate(str, translateserver, fun) {

        if (isArray(translateserver)) {
            for (var i = 0; i < translateserver.length; i++) {
                if (translateserver[i] == 'bd') {
                    translateByBaidu(str, fun);
                }
                else if (translateserver[i] == 'yd') {
                    trabslateByYoudao(str, fun);
                }
            }
        }
    }

    function translateByBaidu(str, fun) {
        var url = location.protocol + '//openapi.baidu.com/public/2.0/bmt/translate?client_id=lS3jRMk7xm7NmV4bqxAQ4bvZ&q=' + encodeURIComponent(str) + '&from=auto&to=auto';
        jsonpGet(url, function(json) {
            var translatearr = json.trans_result;
            var htmlarr = [];
            for (var i = 0; i < translatearr.length; i++) {
                htmlarr.push(translatearr[i].src);
                htmlarr.push(translatearr[i].dst);
            }
            fun && fun('<p>' + htmlarr.join('<br>') + '</p>');
        });
    }

    function showInfo(e) {
        e = e || window.event;
        var txtSel = getSelection().toString();
        if (txtSel && showhtml.style.display != 'block') {

            var leftx = '';
            if ((+e.clientX) < (+document.body.clientWidth) / 2) {
                leftx = 'left:' + (window.pageXOffset + 10 + e.clientX) + 'px;';
            }
            else {
                leftx = ('right:' + (window.pageXOffset + 10 + (+document.body.clientWidth) - (+e.clientX))) + 'px;';
            }
            showhtml.style.cssText = 'display:block;background:#ccc; color:#000000; position:absolute; top:' + (e.clientY + window.pageYOffset + 10) + 'px;' + leftx + ' padding:10px; z-index:10000; border-radius:2px';

            showhtml.innerHTML = '<img src="http://i2.tietuku.com/46a87f3b5a759523.gif" alt="loading">';

            translate(txtSel, ['bd'], function(thtml) {
                showhtml.innerHTML = thtml;
            });
        }
    }

    if (document.getElementById('showhtml_id')) {
        return;
    }

    var showhtml = document.createElement('div');
    showhtml.id = 'showhtml_id';
    showhtml.style.cssText = 'display:none;';
    document.body.appendChild(showhtml);


    document.addEventListener('mouseup', showInfo);
    document.addEventListener('mousedown', function(e) {
        e = e || window.event;
        if (e.target.id !== 'showhtml_id' && e.target.parentNode.id !== 'showhtml_id') {
            showhtml.style.cssText = 'display:none;';
        }
        else {
            e.stopPropagation();
        }
    });
})();
