/**
 * build.js — 打包 com.koewen.theme.aurora 主题插件
 * 用法: node build.js  （需先有 src/theme.css，或用 npx less 生成）
 * 产物: plugins/com.koewen.theme.aurora/index.js + theme-<hash>.js
 *
 * 产物格式与 Tailchat(mini-star) 编译输出一致：
 *   入口 definePlugin('@plugins/<name>', ['require','@capital/common'], factory)
 *   chunk definePlugin('@plugins/<name>/<file>.js', ['exports'], factory)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src', 'theme.css');
const OUT = path.join(ROOT, 'plugins', 'com.koewen.theme.aurora');
const PLUGIN_ID = '@plugins/com.koewen.theme.aurora';

if (!fs.existsSync(SRC)) {
  console.error('missing src/theme.css — run: npx --yes less@4.2.2 src/theme.less src/theme.css');
  process.exit(1);
}

const css = fs.readFileSync(SRC, 'utf8');
const hash = crypto.createHash('md5').update(css).digest('hex').slice(0, 8);
const chunkFile = `theme-${hash}.js`;

// 清理旧产物
for (const f of fs.readdirSync(OUT)) {
  if (/^theme-[0-9a-f]+\.js(\.map)?$/.test(f) || f === 'index.js' || f === 'index.js.map') {
    fs.unlinkSync(path.join(OUT, f));
  }
}

// chunk：CSS 注入器
const chunk = `definePlugin('${PLUGIN_ID}/${chunkFile}',["exports"],function(b){"use strict";
var css = ${JSON.stringify(css)};
try {
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.setAttribute('data-plugin', 'com.koewen.theme.aurora');
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
} catch (e) { console.error('[aurora-theme] inject failed', e); }
});
`;
fs.writeFileSync(path.join(OUT, chunkFile), chunk);

// 入口：注册配色方案，命中时加载样式 chunk
const entry = `definePlugin('${PLUGIN_ID}',["require","@capital/common"],function(r,e){"use strict";e.regPluginColorScheme({label:"\\u6D41\\u5149\\u73BB\\u7483(\\u4EAE\\u8272)",name:"light+aurora"}),e.regPluginColorScheme({label:"\\u6D41\\u5149\\u73BB\\u7483(\\u6697\\u8272)",name:"dark+aurora"}),e.sharedEvent.on("loadColorScheme",function(u){(u==="light+aurora"||u==="dark+aurora")&&new Promise(function(a,o){r(["./${chunkFile.replace(/\.js$/, '')}"],a,o)})})});
`;
fs.writeFileSync(path.join(OUT, 'index.js'), entry);

console.log('built:', chunkFile, `(${(chunk.length / 1024).toFixed(1)} KB)`, '+ index.js');
