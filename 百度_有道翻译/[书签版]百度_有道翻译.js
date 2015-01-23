(function() {
    function jsonpGet(url, funSuccess, funFail) {
        var tempcallback = 'callback_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2);
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';

        if (/\?/.test(url)) {
            var matchstr = url.match(/(.*?)\?(.*)/);
            oScript.src = matchstr[1] + '?callback=' + tempcallback + '&' + matchstr[2];
        }
        else {
            oScript.src = url + '?callback=' + tempcallback;
        }

        oScript.timer = setTimeout(function() {
            funFail && funFail();
        }, 10000);

        oScript.onerror = function() {
            clearTimeout(oScript.timer);
            funFail && funFail();
        };

        document.body.appendChild(oScript);

        window[tempcallback] = function(json) {
            clearTimeout(oScript.timer);
            window[tempcallback] = null;
            document.body.removeChild(oScript);
            funSuccess && funSuccess(json);
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

    function trabslateByYoudao(str, fun) {
        var datastr = JSON.stringify({
            'doctype': 'json',
            'i': str,
            'keyfrom': 'fanyi.web',
            'type': 'AUTO',
            'typoResult': 'true',
            'ue': 'UTF-8'
        });

        var serverurl = location.protocol + '//xinshangshangxin.com/getbyurl';
        var url = serverurl + '?method=post&url=' + encodeURIComponent('http://fanyi.youdao.com/translate') + '&data=' + encodeURIComponent(datastr);
        jsonpGet(url, function(json) {
            var jsondata = JSON.parse(json.data);
            var translatearr = jsondata.translateResult[0];
            var htmlarr = [];
            for (var i = 0; i < translatearr.length; i++) {
                htmlarr.push(translatearr[i].src);
                htmlarr.push(translatearr[i].tgt);
            }
            fun && fun('<p>' + htmlarr.join('<br>') + '</p>');
        });
    }

    function showInfo(e) {
        e = e || window.event;
        var txtSel = getSelection().toString();
        if (txtSel && showhtml.style.display != 'block') {
            translate(txtSel, ['yd'], function(thtml) {
                showhtml.innerHTML = thtml;
                var leftx = '';
                if ((+e.clientX) < (+document.body.clientWidth) / 2) {
                    leftx = 'left:' + (window.pageXOffset + 10 + e.clientX) + 'px;';
                }
                else {
                    leftx = ('right:' + (window.pageXOffset + 10 + (+document.body.clientWidth) - (+e.clientX))) + 'px;';
                }
                showhtml.style.cssText = 'display:block;background:#ccc; color:#000000; position:absolute; top:' + (e.clientY + window.pageYOffset + 10) + 'px;' + leftx + ' padding:10px; z-index:10000; border-radius:2px';
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
