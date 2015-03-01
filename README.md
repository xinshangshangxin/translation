#translation

1. [书签版]百度翻译利用百度翻译api,实现划词翻译
2. `googletranslate.user.js`  userscript 脚本
2. 可直接在书签栏使用,按需使用,支持快捷键`ctrl`双语显示,`ctrl+enter`停止翻译
3. 百度翻译需要 开发者key; 所以只有 1000次/小时;只能自用
4. 仅测试了chrome;其他浏览器未知
5. 发现github已经阻止书签JS了....只能插件/脚本吗?.................

> github 通过window.open 打开新窗口可以解决
> 1. chrome 允许github 打开新窗口
> 2. 添加服务器文件, 并且服务器支持https 且[书签版]百度翻译中
```javascript
r.document.write(document.documentElement.innerHTML.replace(/(<\/head.*?>)/, '<script type="text/javascript" src="https://xinshangshangxin.chinacloudsites.cn/source/bdtranslate.js"></script>$1'));
```
> 网址必须与证书匹配, 即 使用域名网址可能无法加载...

