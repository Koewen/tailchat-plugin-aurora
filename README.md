# Tailchat 流光玻璃主题插件 (com.koewen.theme.aurora)

为 [Tailchat](https://github.com/msgbyte/tailchat) 提供玻璃拟态（Glassmorphism）+ 流光溢彩动效背景的自定义主题插件。

提供两种配色方案：

- **流光玻璃(亮色)** — `light+aurora`
- **流光玻璃(暗色)** — `dark+aurora`

纯前端插件，无后端依赖，加载后仅在切换到对应配色时注入样式。

## 安装方式

### 方式一：插件中心手动安装（个人使用，推荐）

1. 登录 Tailchat 网页端，进入 **个人设置 → 插件中心**（左下角 `···` → 设置 → 插件中心）。
2. 找到 **手动安装** 区域，将下面这份 JSON 粘贴进去，点击安装：

```json
{
  "label": "Aurora Glass Theme",
  "label.zh-CN": "流光玻璃主题",
  "name": "com.koewen.theme.aurora",
  "url": "https://fastly.jsdelivr.net/gh/Koewen/tailchat-plugin-aurora@main/plugins/com.koewen.theme.aurora/index.js",
  "version": "1.0.0",
  "author": "Koewen",
  "description": "Glassmorphism with flowing aurora animated background",
  "description.zh-CN": "玻璃拟态 + 流光溢彩动效背景",
  "requireRestart": false
}
```

3. 安装成功后按提示**刷新页面**。
4. 进入 **系统设置 → 外观 → 主题**，选择 **流光玻璃(亮色)** 或 **流光玻璃(暗色)** 即可生效。

> `url` 走 jsDelivr CDN（国内可达）。若你的网络环境更适合其他 CDN，可将 `url` 替换为：
> `https://cdn.jsdelivr.net/gh/Koewen/tailchat-plugin-aurora@main/plugins/com.koewen.theme.aurora/index.js`

### 方式二：写入实例 registry.json（全体用户可见）

实例管理员将本仓库 `registry.json` 中的条目合并进 Tailchat 前端同源目录的 `client/web/registry.json`（构建后位于 `server/dist/public/registry.json`），重新构建或直接改产物后刷新即可。所有用户都能在插件中心看到并安装本主题。

## 从源码构建

插件源码在 [`src/`](./src)，使用 Tailchat 仓库自带的插件编译链：

```bash
git clone https://github.com/msgbyte/tailchat
cd tailchat
# 将 src 下的 index.ts / theme.less 放入 client/web/plugins/com.koewen.theme.aurora/src/
# 参考 plugins/com.msgbyte.theme.* 官方主题插件的目录结构
npm run plugins:all   # 编译全部插件
```

编译产物输出到 `dist/plugins/com.koewen.theme.aurora/`。

## 仓库结构

```
├── manifest.json                            # 手动安装用（单插件配置）
├── registry.json                            # 注册表格式（供实例管理员合并）
├── plugins/com.koewen.theme.aurora/         # 编译产物（可直接经 CDN 引用）
│   ├── index.js
│   └── theme-*.js
└── src/                                     # 源码
    ├── index.ts
    └── theme.less
```

## 说明

- 主题样式为纯 CSS 注入（渐变 + 动画），不请求任何外部图片/字体资源。
- 插件加载依赖 Tailchat 前端微内核（mini-star），请勿单独改动 `plugins/` 下产物的文件名（入口通过相对路径加载 chunk）。
- Tailchat 本体基于 Apache-2.0，本插件代码以 MIT 协议开源。

## License

[MIT](./LICENSE)
