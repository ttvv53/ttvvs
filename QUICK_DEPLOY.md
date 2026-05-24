# 🎮 午夜庄园谜案 - 快速部署指南

## 最简单的方式：部署到 Render.com（免费，推荐）

### 第一步：推送代码到 GitHub

```bash
# 在项目目录下执行
git init
git add .
git commit -m "初始化推理游戏"
git branch -M main

# 在 GitHub 创建新仓库后，执行：
git remote add origin https://github.com/你的用户名/mystery-game.git
git push -u origin main
```

### 第二步：在 Render 创建服务

1. 访问 **https://render.com** 并用 GitHub 登录
2. 点击 **"New +"** → **"Web Service"**
3. 选择你的 GitHub 仓库
4. 填写配置：
   - **Name**: `mystery-game`（或任意名称）
   - **Region**: Singapore（离中国最近）
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run server:start`
   - **Instance Type**: Free

5. 点击 **"Create Web Service"**

### 第三步：等待部署完成

- 部署约需 2-3 分钟
- 完成后会获得一个网址，如：`https://mystery-game.onrender.com`

### 第四步：分享给朋友

将网址发送给朋友，双方打开即可开始游戏！

---

## 备选方案：Railway.app（免费额度）

1. 访问 **https://railway.app**
2. 用 GitHub 登录
3. 点击 **"New Project"** → **"Deploy from GitHub repo"**
4. 选择仓库，自动部署
5. 获取网址分享

---

## 本地测试生产版本

在部署前，可以在本地测试：

```bash
# 构建并启动生产版本
npm run start

# 访问 http://localhost:3001
```

---

## 系统要求

### 用户端（无需安装）
- **浏览器**: Chrome 80+ / Firefox 75+ / Safari 13+ / Edge 80+
- **网络**: 需要互联网连接
- **无需安装任何软件或插件**

### 服务器端（部署时需要）
- **Node.js**: 18.0 或更高版本
- **内存**: 最低 512MB
- **存储**: 约 100MB

---

## 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台是否有错误，确保 Build Command 正确执行。

### Q: 无法连接到游戏？
A: 确保 WebSocket 连接正常，Render 免费版冷启动需要等待几秒。

### Q: 移动端可以玩吗？
A: 可以！游戏支持手机浏览器，但建议横屏游玩体验更佳。

### Q: 免费服务有限制吗？
A: Render 免费版每月有 750 小时运行时间，足够个人使用。服务闲置后会休眠，首次访问需要等待唤醒（约30秒）。

---

## 文件大小参考

| 内容 | 大小 |
|------|------|
| 前端打包后 | ~500KB |
| 后端代码 | ~50KB |
| 总计 | ~550KB |

用户首次加载约需 1-2 秒（取决于网络速度）。

---

## 技术支持

如有问题，请检查：
1. 浏览器控制台错误信息
2. 服务器日志（Render 控制台可查看）
3. 网络连接是否正常
