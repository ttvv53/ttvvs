# 最简单的部署方法

## 方法一：ngrok（推荐，最简单）

### 步骤：

1. **安装 ngrok**
   - 访问 https://ngrok.com 下载
   - 或用命令：`winget install ngrok`（Windows）

2. **启动游戏**
   ```bash
   npm run dev
   ```

3. **生成公网链接**（新开一个终端）
   ```bash
   ngrok http 3001
   ```

4. **分享链接**
   - ngrok 会显示类似：`https://abc123.ngrok.io`
   - 将此链接发给朋友即可！

**优点**：无需注册云服务，无需推送代码，本地运行即可
**缺点**：链接每次重启会变化（免费版）

---

## 方法二：Railway 一键部署

1. 访问 https://railway.app
2. 用 GitHub 登录
3. 点击 "Deploy from GitHub"
4. 选择仓库 → 自动部署 → 获得链接

**优点**：真正的云部署，链接永久有效
**缺点**：需要先推送代码到 GitHub

---

## 方法三：直接分享本地 IP（局域网）

适合在同一 WiFi 下的朋友：

1. 获取本机 IP：
   ```bash
   ipconfig
   ```
   找到 "IPv4 地址"，如 `192.168.1.100`

2. 启动游戏：
   ```bash
   npm run dev
   ```

3. 朋友访问：`http://192.168.1.100:5174`

**优点**：最简单，无需任何工具
**缺点**：仅限同一网络

---

## 方法四：使用 Vercel（一键部署）

1. 访问 https://vercel.com
2. 用 GitHub 登录
3. 点击 "Import Project"
4. 选择仓库 → Deploy

**优点**：免费，快速，自动 HTTPS
**缺点**：需要适配 Vercel 的 serverless 架构

---

## 推荐选择

| 场景 | 推荐方法 |
|------|---------|
| 快速测试 | ngrok |
| 同一 WiFi | 本地 IP |
| 长期使用 | Railway |
| 最简单 | ngrok |
