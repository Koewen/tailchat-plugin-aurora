definePlugin('@plugins/com.koewen.theme.aurora/theme-3735a72f.js',["exports"],function(b){"use strict";var d=[],e=[];function u(r,a){if(r&&typeof document!="undefined"){var n,o=a.prepend===!0?"prepend":"append",h=a.singleTag===!0,p=typeof a.container=="string"?document.querySelector(a.container):document.getElementsByTagName("head")[0];if(h){var t=d.indexOf(p);t===-1&&(t=d.push(p)-1,e[t]={}),n=e[t]&&e[t][o]?e[t][o]:e[t][o]=g()}else n=g();r.charCodeAt(0)===65279&&(r=r.substring(1)),n.styleSheet?n.styleSheet.cssText+=r:n.appendChild(document.createTextNode(r))}function g(){var s=document.createElement("style");if(s.setAttribute("type","text/css"),a.attributes)for(var c=Object.keys(a.attributes),i=0;i<c.length;i++)s.setAttribute(c[i],a.attributes[c[i]]);var m=o==="prepend"?"afterbegin":"beforeend";return p.insertAdjacentElement(m,s),s}}var l=`/* purgecss start ignore */

#tailchat-app.theme-aurora {
  --tc-primary-color: #6aa3ff;
  --glass-bg: rgba(255, 255, 255, 0.14);
  --glass-bg-strong: rgba(255, 255, 255, 0.24);
  --glass-bd: rgba(255, 255, 255, 0.3);
  --glass-blur: 18px;
  --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  /* ---------- \u6D41\u5149\u6EA2\u5F69\u52A8\u6548\u80CC\u666F ---------- */
  position: relative;
  /* \u6781\u5149\u5149\u6591\u7F13\u6162\u6F02\u79FB */
  /* \u65CB\u8F6C\u6D41\u5149\u53E0\u52A0 */
  /* \u5185\u5BB9\u5C42\u9700\u5728\u80CC\u666F\u4E4B\u4E0A */
  /* ---------- \u73BB\u7483\u62DF\u6001 ---------- */
  /* \u6D88\u606F\u6C14\u6CE1 / \u5361\u7247 / \u9762\u677F / \u8F93\u5165\u6846 */
  /* \u6309\u94AE\u4E0E\u9AD8\u4EAE\u5143\u7D20\uFF1A\u73BB\u7483\u9AD8\u5149 */
  /* \u6EDA\u52A8\u6761\u5F31\u5316\uFF0C\u7A81\u51FA\u73BB\u7483\u611F */
}

#tailchat-app.theme-aurora:before,
#tailchat-app.theme-aurora:after {
  content: '';
  position: fixed;
  inset: -25%;
  z-index: 0;
  pointer-events: none;
}

#tailchat-app.theme-aurora:before {
  filter: blur(70px);
  opacity: 0.7;
  background: radial-gradient(circle at 18% 28%, #5b8cff 0, transparent 42%), radial-gradient(circle at 82% 22%, #b06cff 0, transparent 42%), radial-gradient(circle at 55% 82%, #34d3ff 0, transparent 46%), radial-gradient(circle at 30% 70%, #ff7ac6 0, transparent 40%);
  animation: aurora-drift 26s ease-in-out infinite alternate;
}

#tailchat-app.theme-aurora:after {
  opacity: 0.28;
  filter: blur(60px);
  background: conic-gradient(from 0deg, rgba(91, 140, 255, 0.45), rgba(176, 108, 255, 0.45), rgba(52, 211, 255, 0.45), rgba(255, 122, 198, 0.4), rgba(91, 140, 255, 0.45));
  animation: aurora-spin 45s linear infinite;
}

@keyframes aurora-drift {
  0% {
    transform: translate3d(-3%, -2%, 0) scale(1);
  }

  50% {
    transform: translate3d(3%, 2%, 0) scale(1.12);
  }

  100% {
    transform: translate3d(-2%, 3%, 0) scale(1.04);
  }
}

@keyframes aurora-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

#tailchat-app.theme-aurora > * {
  position: relative;
  z-index: 1;
}

#tailchat-app.theme-aurora .bg-navbar-light,
#tailchat-app.theme-aurora .bg-navbar-dark,
#tailchat-app.theme-aurora .bg-sidebar-light,
#tailchat-app.theme-aurora .bg-sidebar-dark,
#tailchat-app.theme-aurora [class*='bg-content-'],
#tailchat-app.theme-aurora [data-tc-role^='content-'] {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(var(--glass-blur)) saturate(170%);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(170%);
  border: 1px solid var(--glass-bd);
  box-shadow: var(--glass-shadow);
}

#tailchat-app.theme-aurora .chat-message-item,
#tailchat-app.theme-aurora .message-item,
#tailchat-app.theme-aurora [data-tc-role='message'],
#tailchat-app.theme-aurora .el-card,
#tailchat-app.theme-aurora .el-input__wrapper,
#tailchat-app.theme-aurora .el-textarea__inner,
#tailchat-app.theme-aurora .el-dropdown-menu,
#tailchat-app.theme-aurora .el-dialog,
#tailchat-app.theme-aurora .el-popover,
#tailchat-app.theme-aurora .plugin-panel,
#tailchat-app.theme-aurora [class*='panel-'] {
  background: var(--glass-bg) !important;
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--glass-bd) !important;
  box-shadow: var(--glass-shadow);
  border-radius: 14px;
}

#tailchat-app.theme-aurora .el-button:not(.el-button--text):not(.is-link),
#tailchat-app.theme-aurora [class*='btn-'] {
  background: var(--glass-bg-strong) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--glass-bd) !important;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

#tailchat-app.theme-aurora .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 26px rgba(31, 38, 135, 0.22);
}

#tailchat-app.theme-aurora ::-webkit-scrollbar-thumb {
  background: var(--glass-bg-strong);
  border-radius: 8px;
}

/* \u6697\u8272\u6863\uFF1A\u52A0\u6DF1\u73BB\u7483\u5E95\u8272\u3001\u63D0\u9AD8\u53D1\u5149\u5BF9\u6BD4 */

#tailchat-app.theme-aurora.dark,
#tailchat-app.dark.theme-aurora {
  --glass-bg: rgba(16, 20, 40, 0.32);
  --glass-bg-strong: rgba(20, 26, 50, 0.5);
  --glass-bd: rgba(255, 255, 255, 0.16);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
}

/* purgecss end ignore */
`;u(l,{}),b.css=l,b.default=l});
//# sourceMappingURL=theme-3735a72f.js.map
