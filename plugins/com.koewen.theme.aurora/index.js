definePlugin('@plugins/com.koewen.theme.aurora',["require","@capital/common"],function(r,e){"use strict";
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
e.regPluginColorScheme({label:"\u6D41\u5149\u73BB\u7483(\u4EAE\u8272)",name:"light+aurora"});
e.regPluginColorScheme({label:"\u6D41\u5149\u73BB\u7483(\u6697\u8272)",name:"dark+aurora"});
e.sharedEvent.on("loadColorScheme",function(u){
  if(u==="light+aurora"||u==="dark+aurora"){
    new Promise(function(a,o){r(["./theme-a05516a5"],a,o)});
    startBubbles();
  }
});
});
