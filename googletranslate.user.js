// ==UserScript==
// @name           googletranslate
// @version        15.03.01
// @description    谷歌翻译
// @icon           http://i3.tietuku.com/11d6c35e96ef7c9f.jpg
// @include        *
// @grant          GM_xmlhttpRequest
// @auther         SHANG殇
// @namespace      SHANG
// ==/UserScript==


var isstart = false;
var showhtml = null;
document.addEventListener('keydown', function(e) {
    e = e || window.event;
    if (isstart && e.keyCode === 17) {
        showhtml.isshow = !showhtml.isshow;
        if (showhtml.isshow) {
            showhtml.innerHTML = showhtml.innerHTML.replace(/display:none/gi, 'display:block');
        } else {
            showhtml.innerHTML = showhtml.innerHTML.replace(/display:block/gi, 'display:none');
        }
    } else if (e.keyCode === 13 && e.ctrlKey) {
        if (!isstart) {
            init();
            console.log('init end');
            isstart = true;
        } else {
            showhtml.isstop = !showhtml.isstop;
            if (showhtml.isstop) {
                showhtml.innerHTML = 'stop translation!!';
            } else {
                showhtml.innerHTML = 'start translation!!';
            }
        }

    }
});

function init() {
    showhtml = document.createElement('div');
    showhtml.id = 'showhtml_id';
    showhtml.style.cssText = 'display:none;';
    showhtml.isshow = false;
    showhtml.isstop = false;

    showhtml.addEventListener('mousedown', dragHandler, false);
    document.body.appendChild(showhtml);
    addCssLoading();

    var savedTarget = null;
    var orgCursor = null;
    var dragOK = false;
    var dragXoffset = 0;
    var dragYoffset = 0;
    var width = 0,
        height = 0;
    var timer = null;


    document.addEventListener('mouseup', showInfo);
    document.addEventListener('mousedown', function(e) {
        e = e || window.event;
        if (e.target.id !== 'showhtml_id' && e.target.parentNode && e.target.parentNode.id !== 'showhtml_id') {
            showhtml.style.cssText = 'display:none;';
        } else {
            e.stopPropagation();
        }
    });

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function translateByBaidu(str, fun, funFail) {
        var protocol = location.protocol;
        var url = (protocol.match('file') ? 'http:' : protocol)
            // http://translate.google.cn/translate_a/t?client=json&text=do%20not%20do%20this%20%0A%20do%20not%20do%20this&langpair=auto|auto
        var currentPostData = 'client=json&text=' + encodeURIComponent(str) + '&langpair=auto|auto';
        GM_xmlhttpRequest({
            method: 'POST',
            url: url + '//translate.google.cn/translate_a/t',
            data: currentPostData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(res) {
                var json = JSON.parse(res.responseText);
                var translatearr = json.sentences;
                var htmlarrsrc = [];
                var htmlarrdst = [];
                for (var i = 0; i < translatearr.length; i++) {
                    htmlarrsrc.push(translatearr[i].orig);
                    htmlarrdst.push(translatearr[i].trans);
                }
                fun && fun(htmlarrsrc, htmlarrdst);
            }
        });
    }

    function showInfo(e) {
        console.log('123');
        if (showhtml.isstop || e.target.id === 'showhtml_id' || e.target.parentNode && e.target.parentNode.id === 'showhtml_id') {
            return;
        }

        e = e || window.event;
        clearTimeout(timer);
        timer = setTimeout(function() {
            var txtSel = getSelection().toString();
            if (txtSel) {
                showhtml.isshow = false;
                var leftx = '';
                if ((+e.clientX) < (+document.body.clientWidth) / 2) {
                    leftx = 'left:' + (window.pageXOffset + 10 + e.clientX) + 'px;';
                } else {
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




    function moveHandler(e) {
        if (e === null) {
            return;
        }
        if (e.button <= 1 && dragOK) {

            var leftpos = e.clientX - dragXoffset;
            var toppos = e.clientY - dragYoffset;

            if (leftpos + width + 35 >= document.body.clientWidth) {
                leftpos = document.body.clientWidth - width - 35;
            } else if (leftpos <= 0) {
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
}
