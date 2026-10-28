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
// chunk 文件名占位符：真实 hash 在末尾按「CSS + chunk + entry」联合内容计算，
// 确保 JS 变更也会产生新文件名，避免 CDN/浏览器复用旧 chunk
let chunkFile = '__CHUNK__';

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
function startNavbar(){
  if(window.__auroraNav) return;
  window.__auroraNav=true;
  var KEY='au_nav_expand';
  var nameBySrc={}, nameByChar={};
  function appEl(){ return document.getElementById('tailchat-app'); }
  function isOn(){ var a=appEl(); return !!(a&&a.classList.contains('au-nav-expand')); }
  function apply(on){
    var a=appEl(); if(!a) return;
    a.classList.toggle('au-nav-expand', !!on);
    var b=document.querySelector('.au-nav-toggle');
    if(b){
      b.title=on?'收起侧边栏':'展开侧边栏';
      b.setAttribute('aria-label',on?'收起侧边栏':'展开侧边栏');
      b.setAttribute('aria-expanded',on?'true':'false');
    }
  }
  function toggle(){
    var on=!isOn();
    try{ localStorage.setItem(KEY,on?'1':'0'); }catch(e){}
    apply(on);
  }
  function labelize(){
    var host=document.querySelector('[data-tc-role="navbar-groups"]');
    if(!host) return;
    var items=host.querySelectorAll('div.px-3');
    for(var i=0;i<items.length;i++){
      var it=items[i];
      if(it.querySelector('.au-nav-label')) continue;
      var name='';
      var img=it.querySelector('img');
      if(img){
        var f=(img.getAttribute('src')||'').split('/').pop().split('?')[0];
        name=nameBySrc[f]||'';
      } else {
        var sp=it.querySelector('.ant-avatar');
        var t=sp?(sp.textContent||'').trim():'';
        name=nameByChar[t]||'';
      }
      if(!name) continue;
      var l=document.createElement('span');
      l.className='au-nav-label';
      l.textContent=name;
      l.title=name;
      l.onclick=(function(item){
        return function(){
          var trg=item.querySelector('div.w-12');
          if(trg) trg.click();
        };
      })(it);
      it.appendChild(l);
    }
  }
  var ICON='<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8.4 4.2 16.8 12 8.4 19.8V4.2z"/></svg>';
  function ensureBtn(){
    var nav=document.querySelector('[data-tc-role="navbar"]');
    if(!nav) return;
    var b=nav.querySelector('.au-nav-toggle');
    if(!b){
      b=document.createElement('button');
      b.className='au-nav-toggle';
      b.setAttribute('type','button');
      b.setAttribute('data-tc-role','au-nav-toggle');
      b.innerHTML='<span class="au-tri">'+ICON+'</span>';
      b.onclick=function(ev){ ev.preventDefault(); ev.stopPropagation(); toggle(); };
      // 置于导航栏顶部，首屏即可见（不再藏在底部设置区）
      nav.insertBefore(b, nav.firstChild);
    }
    apply(isOn());
  }
  function fetchNames(){
    try{
      var raw=localStorage.getItem('jsonwebtoken')||'';
      var jwt=(function(){try{return JSON.parse(raw).rawData||raw;}catch(x){return raw;}})();
      fetch('/api/group/getUserGroups',{method:'POST',headers:{'Content-Type':'application/json','X-Token':jwt},body:'{}'})
        .then(function(r){return r.json();})
        .then(function(j){
          var d=j&&j.data;
          var gs=Array.isArray(d)?d:((d&&d.groups)||[]);
          for(var i=0;i<gs.length;i++){
            var n=String(gs[i].name||'').trim();
            if(!n) continue;
            var av=String(gs[i].avatar||'');
            if(av){ nameBySrc[av.split('/').pop().split('?')[0]]=n; }
            var k=n.slice(0,1);
            if(!nameByChar[k]) nameByChar[k]=n;
          }
          labelize();
        })['catch'](function(){});
    }catch(e){}
  }
  var t=null;
  var navMo=new MutationObserver(function(){
    if(t) clearTimeout(t);
    t=setTimeout(function(){ ensureBtn(); labelize(); },120);
  });
  function begin(){
    var a=appEl();
    var nav=document.querySelector('[data-tc-role="navbar"]');
    if(!a||!nav) return false;
    var on=false;
    try{ on=localStorage.getItem(KEY)==='1'; }catch(e){}
    apply(on);
    ensureBtn();
    navMo.observe(nav,{childList:true,subtree:true});
    fetchNames();
    return true;
  }
  var tries=0;
  (function wait(){
    if(begin()) return;
    if(++tries<100) setTimeout(wait,300);
  })();
}
e.regPluginColorScheme({label:"\\u6D41\\u5149\\u73BB\\u7483(\\u4EAE\\u8272)",name:"light+aurora"});e.regPluginColorScheme({label:"\\u6D41\\u5149\\u73BB\\u7483(\\u6697\\u8272)",name:"dark+aurora"});
e.sharedEvent.on("loadColorScheme",function(u){
  if(u==="light+aurora"||u==="dark+aurora"){
    new Promise(function(a,o){r(["./${chunkFile.replace(/\.js$/, '')}"],a,o)});
    startBubbles();
    startNavbar();
  }
});
});
`;

// 最終 hash：CSS + chunk + entry 聯合內容計算，保證 JS 改動也會換 chunk 文件名
const hash = crypto
  .createHash('md5')
  .update(css + chunk + entry)
  .digest('hex')
  .slice(0, 8);
chunkFile = `theme-${hash}.js`;
fs.writeFileSync(
  path.join(OUT, chunkFile),
  chunk.replace(/__CHUNK__/g, chunkFile)
);
fs.writeFileSync(
  path.join(OUT, 'index.js'),
  entry.replace(/__CHUNK__/g, chunkFile)
);

console.log('built:', chunkFile, `(${(chunk.length / 1024).toFixed(1)} KB)`, '+ index.js');