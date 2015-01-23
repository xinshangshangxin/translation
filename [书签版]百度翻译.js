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

    function translateByBaidu(str, fun, funFail) {
        var url = location.protocol + '//openapi.baidu.com/public/2.0/bmt/translate?client_id=lS3jRMk7xm7NmV4bqxAQ4bvZ&from=auto&to=auto&q=' + encodeURIComponent(str);
        jsonpGet(
            url,
            function(json) {
                var translatearr = json.trans_result;
                var htmlarr = [];
                for (var i = 0; i < translatearr.length; i++) {
                    htmlarr.push(translatearr[i].src);
                    htmlarr.push(translatearr[i].dst);
                }
                fun && fun('<p>' + htmlarr.join('<br>') + '</p>');
            },
            funFail
        );
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

            showhtml.innerHTML = '<div class="translate_spinner"></div>';

            translateByBaidu(
                txtSel,
                function(thtml) {
                    showhtml.innerHTML = thtml;
                },
                function() {
                    showhtml.innerHTML = '请求失败~~!';
                }
            );
        }
    }


    function addCssLoading() {
        var oCss = document.createElement('style');
        oCss.type = 'text/css';
        oCss.innerHTML = '.translate_spinner { width: 40px; height: 40px; background-color: black; border-radius: 100%; -webkit-animation: scaleout 1.0s infinite ease-in-out; animation: scaleout 1.0s infinite ease-in-out; } @-webkit-keyframes scaleout { 0% { -webkit-transform: scale(0.0) } 100% { -webkit-transform: scale(1.0); opacity: 0; } } @keyframes scaleout { 0% { transform: scale(0.0); -webkit-transform: scale(0.0); } 100% { transform: scale(1.0); -webkit-transform: scale(1.0); opacity: 0; } }';
        document.head.appendChild(oCss);
    }

    if (document.getElementById('showhtml_id')) {
        return;
    }

    var showhtml = document.createElement('div');
    showhtml.id = 'showhtml_id';
    showhtml.style.cssText = 'display:none;';
    document.body.appendChild(showhtml);
    addCssLoading();


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
