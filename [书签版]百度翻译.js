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
        var protocol = location.protocol;
        var url = protocol.match('file') ? 'http:' : protocol + '//openapi.baidu.com/public/2.0/bmt/translate?client_id=lS3jRMk7xm7NmV4bqxAQ4bvZ&from=auto&to=auto&q=' + encodeURIComponent(str);
        jsonpGet(
            url,
            function(json) {
                var translatearr = json.trans_result;
                var htmlarrsrc = [];
                var htmlarrdst = [];
                for (var i = 0; i < translatearr.length; i++) {
                    htmlarrsrc.push(translatearr[i].src);
                    htmlarrdst.push(translatearr[i].dst);
                }
                fun && fun(htmlarrsrc, htmlarrdst);
            },
            funFail
        );
    }

    function showInfo(e) {
        if (isstop) {
            return;
        }
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
                function(htmlarrsrc, htmlarrdst) {
                    for (var i = 0; i < htmlarrsrc.length; i++) {
                        showhtml.innerHTML = '<div style="display:none; font-size:0.4em; color:#575757">' + htmlarrsrc.join('<br>') + '</div>' + '<div>' + htmlarrdst.join('<br>') + '</div>';
                    }
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


    if (window.location.href.match(/github.com/)) {
        var r = window.open("", "", "");
        r.opener = null;
        r.document.write(document.documentElement.innerHTML.replace(/(<\/head.*?>)/, '<script type="text/javascript" src="https://xinshangshangxin.chinacloudsites.cn/source/bdtranslate.js"></script>$1'));
        r.document.close();
        return;
    }


    if (document.getElementById('showhtml_id')) {
        return;
    }

    var isstop = false;

    var showhtml = document.createElement('div');
    showhtml.id = 'showhtml_id';
    showhtml.style.cssText = 'display:none;';
    showhtml.isshow = 0;
    document.body.appendChild(showhtml);
    addCssLoading();

    document.addEventListener('keydown', function(e) {
        e = e || window.event;
        if (e.keyCode === 17 && showhtml.innerHTML) {
            showhtml.isshow = !showhtml.isshow;
            if (showhtml.isshow) {
                showhtml.innerHTML = showhtml.innerHTML.replace('display:none', 'display:block');
            }
            else {
                showhtml.innerHTML = showhtml.innerHTML.replace('display:block', 'display:none');
            }
        }
        else if (e.keyCode == 13 && e.ctrlKey) {
            isstop = !isstop;
            showhtml.innerHTML = 'stop translation!!';
        }
    });


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
