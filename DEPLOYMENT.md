# 游戏部署指南

## 方案一：部署到 Render.com（推荐，免费）

### 步骤：

1. **创建 Render 账号**
   - 访问 https://render.com
   - 使用 GitHub 账号登录

2. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # 在 GitHub 创建新仓库后
   git remote add origin https://github.com/你的用户名/你的仓库.git
   git push -u origin main
   ```

3. **在 Render 创建服务**
   - 点击 "New" → "Web Service"
   - 连接你的 GitHub 仓库
   - 配置：
     - Name: mystery-game
     - Build Command: `npm install && npm run build`
     - Start Command: `node api/gameServer.js`
     - 环境变量: NODE_ENV=production

4. **获取网址**
   - 部署完成后，Render 会提供一个网址如：`https://mystery-game.onrender.com`
   - 将此链接分享给朋友即可游玩！

---

## 方案二：部署到 Railway（免费额度）

1. 访问 https://railway.app
2. 使用 GitHub 登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择你的仓库
5. 自动部署，获取网址

---

## 方案三：本地运行分享（局域网）

如果想在本地运行并通过局域网分享给同一网络的朋友：

### 步骤：

1. **修改 vite.config.ts**
```typescript
server: {
  host: '0.0.0.0', // 允许外部访问
  port: 5174,
  // ... 其他配置
}
```

2. **修改 WebSocket 地址**
在 `src/store/mysteryStore.ts` 中：
```typescript
const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : `http://${window.location.hostname}:3001`;
```

3. **获取本机 IP**
   - Windows: 打开命令行，输入 `ipconfig`
   - 找到 "IPv4 地址"，如 `192.168.1.100`

4. **启动游戏**
```bash
npm run dev
```

5. **分享给朋友**
   - 同一网络的朋友访问：`http://192.168.1.100:5174`

---

## 方案四：打包为桌面应用（Electron）

适合离线游玩或分发安装包。

### 步骤：

1. **安装 Electron**
```bash
npm install electron electron-builder --save-dev
```

2. **创建 Electron 主进程文件** `electron/main.js`

3. **打包命令**
```bash
npm run electron:build
```

4. **输出文件**
   - Windows: `.exe` 安装包
   - Mac: `.dmg` 安装包
   - Linux: `.AppImage` 或 `.deb`

---

## 系统要求

### 网页版（推荐）
- **浏览器**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **网络**: 需要互联网连接（联机游戏）
- **无需安装任何软件**

### 桌面版
- **Windows**: Windows 10 或更高版本
- **Mac**: macOS 10.15 或更高版本
- **Linux**: Ubuntu 18.04 或更高版本

---

## 分发文件大小

| 方式 | 大小 | 说明 |
|------|------|------|
| 网页部署 | ~2MB | 用户无需下载，直接访问 |
| Windows 安装包 | ~80MB | 包含 Electron 运行时 |
| Mac 安装包 | ~100MB | 包含 Electron 运行时 |

---

## 兼容性问题解决

### 问题1：WebSocket 连接失败
**原因**: 防火墙或代理阻止 WebSocket
**解决**: 
- 确保服务器端口 3001 开放
- 或使用 nginx 配置 WebSocket 代理

### 问题2：移动端无法游玩
**原因**: 屏幕尺寸适配
**解决**: 游戏已做响应式设计，手机浏览器可正常游玩

### 问题3：浏览器不支持
**原因**: 使用了较新的 JavaScript 特性
**解决**: 
- 在 `vite.config.ts` 中配置 `build.target: 'es2015'`
- 或提示用户升级浏览器

---

## 快速部署脚本

运行以下命令可自动构建生产版本：

```bash
npm run build
```

构建产物在 `dist/` 目录，可部署到任何静态托管服务。
