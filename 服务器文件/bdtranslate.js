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
        if (showhtml.isstop || e.target.id === 'showhtml_id' || e.target.parentNode && e.target.parentNode.id === 'showhtml_id') {
            return;
        }
        e = e || window.event;

        setTimeout(function() {
            var txtSel = getSelection().toString();
            if (txtSel) {
                showhtml.isshow = false;
                var leftx = '';
                if ((+e.clientX) < (+document.body.clientWidth) / 2) {
                    leftx = 'left:' + (window.pageXOffset + 10 + e.clientX) + 'px;';
                }
                else {
                    leftx = ('right:' + (window.pageXOffset + 10 + (+document.body.clientWidth) - (+e.clientX))) + 'px;';
                }
                showhtml.style.cssText = 'display:block;background:#ccc; color:#000000; position:absolute; top:' + (e.clientY + window.pageYOffset + 10) + 'px;' + leftx + ' padding:15px; z-index:10000; border-radius:2px';
                showhtml.innerHTML = '<div class="translate_spinner"></div>';

                translateByBaidu(
                    txtSel,
                    function(htmlarrsrc, htmlarrdst) {
                        var tempstr = '';
                        for (var i = 0; i < htmlarrsrc.length; i++) {
                            tempstr += '<span style="display:none; font-size:0.4em; color:#575757">' + htmlarrsrc[i] + '</span>' + '<span>' + htmlarrdst[i] + '</span>';
                        }
                        showhtml.style.width = 'auto';
                        showhtml.innerHTML = tempstr;
                    },
                    function() {
                        showhtml.innerHTML = '请求失败~~!';
                    }
                );
            }
        }, 20);
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


    var savedTarget = null;
    var orgCursor = null;
    var dragOK = false;
    var dragXoffset = 0;
    var dragYoffset = 0;
    var width = 0,
        height = 0;

    function moveHandler(e) {
        if (e === null) {
            return;
        }
        if (e.button <= 1 && dragOK) {

            var leftpos = e.clientX - dragXoffset;
            var toppos = e.clientY - dragYoffset;

            if (leftpos + width + 35 >= document.body.clientWidth) {
                leftpos = document.body.clientWidth - width - 35;
            }
            else if (leftpos <= 0) {
                leftpos = 0;
            }

            savedTarget.style.left = leftpos + 'px';
            savedTarget.style.top = toppos + 'px';
            return false;
        }
    }

    function dragCleanup(e) {
        document.removeEventListener('mousemove', moveHandler, false);
        document.removeEventListener('mouseup', dragCleanup, false);
        savedTarget.style.cursor = orgCursor;

        dragOK = false;
    }

    function dragHandler(e) {
        if (e === null) {
            return;
        }
        var target = e.target;
        var htype = 'move';

        orgCursor = target.style.cursor;

        if (e.target.id === 'showhtml_id') {
            savedTarget = target;
            target.style.cursor = htype;
            dragOK = true;
            dragXoffset = e.clientX - target.offsetLeft;
            dragYoffset = e.clientY - target.offsetTop;

            width = parseFloat(getComputedStyle(target).width);
            target.style.width = width + 'px';

            document.addEventListener('mousemove', moveHandler, false);
            document.addEventListener('mouseup', dragCleanup, false);
            return false;
        }
    }

    var showhtml = document.createElement('div');


    window.onload = function() {
        showhtml.id = 'showhtml_id';
        showhtml.style.cssText = 'display:none;';
        showhtml.isshow = false;
        showhtml.isstop = false;
        showhtml.addEventListener('mousedown', dragHandler, false);
        document.body.appendChild(showhtml);
        addCssLoading();
    }


    document.addEventListener('keydown', function(e) {
        e = e || window.event;
        if (e.keyCode === 17 && showhtml.innerHTML) {
            showhtml.isshow = !showhtml.isshow;
            if (showhtml.isshow) {
                showhtml.innerHTML = showhtml.innerHTML.replace(/display:none/gi, 'display:block');
            }
            else {
                showhtml.innerHTML = showhtml.innerHTML.replace(/display:block/gi, 'display:none');
            }
        }
        else if (e.keyCode == 13 && e.ctrlKey) {
            showhtml.isstop = !showhtml.isstop;
            if (showhtml.isstop) {
                showhtml.innerHTML = 'stop translation!!';
            }
            else {
                showhtml.innerHTML = 'start translation!!';
            }
        }
    });


    document.addEventListener('mouseup', showInfo);
    document.addEventListener('mousedown', function(e) {
        e = e || window.event;
        if (e.target.id !== 'showhtml_id' && e.target.parentNode && e.target.parentNode.id !== 'showhtml_id') {
            showhtml.style.cssText = 'display:none;';
        }
        else {
            e.stopPropagation();
        }
    });

})();
