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

// 入口：注册配色方案，命中时加载样式 chunk + 启动气泡左右分栏标记
const entry = `definePlugin('${PLUGIN_ID}',["require","@capital/common"],function(r,e){"use strict";
var mo=null;
function readMe(){
  try{
    if(typeof e.getJWTUserInfo==='function'){
      return Promise.resolve().then(function(){return e.getJWTUserInfo();}).then(function(me){
        if(me&&me.nickname) return {nickname:String(me.nickname).trim(),avatar:String(me.avatar||'')};
        throw new Error('empty');
      });
    }
    throw new Error('no api');
  }catch(x){
    // 零依赖回退：从 localStorage 的 jsonwebtoken 解 JWT payload（支持中文）
    return new Promise(function(res){
      try{
        var raw=localStorage.getItem('jsonwebtoken')||'';
        var jwt=(function(){try{var j=JSON.parse(raw);return (j&&j.rawData)||raw;}catch(x2){return raw;}})();
        var p=jwt.split('.')[1]||'';
        p=p.replace(/-/g,'+').replace(/_/g,'/');
        while(p.length%4)p+='=';
        var bin=atob(p);
        var json=decodeURIComponent(Array.prototype.map.call(bin,function(c){return '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);}).join(''));
        var o=JSON.parse(json);
        res({nickname:String(o.nickname||'').trim(),avatar:String(o.avatar||''),rawJwt:jwt});
      }catch(e3){res({nickname:'',avatar:''});}
    });
  }
}
function startBubbles(){
  if(mo) return;
  readMe().then(function(me){
    var nick=me.nickname;
    var avFile=me.avatar?me.avatar.split('/').pop():'';
    function mark(retry){
      var rows=document.querySelectorAll('.chat-message-item');
      var lastCls='';
      var pending=false;
      for(var i=0;i<rows.length;i++){
        var row=rows[i];
        var head=row.querySelector(':scope > div:nth-child(2) .font-bold');
        var txt=head?(head.textContent||'').trim():'';
        var cls='';
        if(txt){
          var img=row.querySelector('img[src]');
          var src=img?img.getAttribute('src'):'';
          if(nick&&txt===nick) cls='msg-self';
          else if(avFile&&src&&src.indexOf(avFile)>-1) cls='msg-self';
          else cls='msg-other';
        } else if(lastCls){
          cls=lastCls;
        } else {
          pending=true;
        }
        if(cls){
          if(!row.classList.contains(cls)){
            row.classList.remove('msg-self','msg-other');
            row.classList.add(cls);
          }
          lastCls=cls;
        } else {
          row.classList.remove('msg-self','msg-other');
        }
      }
      if(pending&&(retry||0)<60){
        requestAnimationFrame(function(){mark((retry||0)+1);});
      }
    }
    mo=new MutationObserver(function(){requestAnimationFrame(function(){mark(0);});});
    mo.observe(document.body,{childList:true,subtree:true});
    mark(0);
    window.__auroraDebug={nick:nick,avFile:avFile,raw:me.rawJwt||''};
  })['catch'](function(err){console.warn('[aurora] bubbles init failed',err);});
}
e.regPluginColorScheme({label:"\\u6D41\\u5149\\u73BB\\u7483(\\u4EAE\\u8272)",name:"light+aurora"});
e.regPluginColorScheme({label:"\\u6D41\\u5149\\u73BB\\u7483(\\u6697\\u8272)",name:"dark+aurora"});
e.sharedEvent.on("loadColorScheme",function(u){
  if(u==="light+aurora"||u==="dark+aurora"){
    new Promise(function(a,o){r(["./${chunkFile.replace(/\.js$/, '')}"],a,o)});
    startBubbles();
  }
});
});
`;
fs.writeFileSync(path.join(OUT, 'index.js'), entry);

console.log('built:', chunkFile, `(${(chunk.length / 1024).toFixed(1)} KB)`, '+ index.js');
