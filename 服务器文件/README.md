#此文件已失效!!!!!!!!
##此方法有bug,失效

1. 此文件用来外部加载时使用
2. 此文件与前面的百度翻译文件diff

```javascript
//添加window.onload
window.onload = function() {
    if (document.getElementById('showhtml_id')) {
        return;
    }

    showhtml = document.createElement('div');
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
};


//去除下面代码[判断github]
if (window.location.href.match(/github.com/)) {
    var r = window.open("", "", "");
    r.opener = null;
    r.document.write(document.documentElement.innerHTML.replace(/(<head.*?>)/, '$1<script type="text/javascript" src="https://xinshangshangxin.com/source/bdtranslate.js"></script>'));
    r.document.close();
    return;
}
```