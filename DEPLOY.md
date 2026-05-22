# WriteQuest 多平台部署指南

## 快速部署步骤

### 1. GitHub Pages 部署（推荐）

#### 步骤 1: 创建 GitHub 仓库
1. 访问 https://github.com/new
2. 仓库名称: `writequest`（或你喜欢的名字）
3. 选择 Public（公开）
4. 点击 "Create repository"

#### 步骤 2: 推送代码
```bash
cd writequest
git init
git add .
git commit -m "Initial commit: WriteQuest - 写作冒险游戏"
git branch -M main
git remote add origin https://github.com/你的用户名/writequest.git
git push -u origin main
```

#### 步骤 3: 启用 GitHub Pages
1. 访问仓库页面: `https://github.com/你的用户名/writequest`
2. 点击 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 等待自动部署完成（约 2-3 分钟）
5. 访问: `https://你的用户名.github.io/writequest/`

---

### 2. Vercel 部署（推荐）

#### 方法 A: 通过 GitHub 自动部署（推荐）
1. 访问 https://vercel.com/new
2. 导入你的 GitHub 仓库
3. 框架预设选择 "Vite"
4. 点击 Deploy
5. 等待部署完成，获得 `.vercel.app` 域名

#### 方法 B: 手动部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
cd writequest
vercel --prod
```

---

### 3. Netlify 部署

#### 方法 A: 通过 GitHub 自动部署（推荐）
1. 访问 https://app.netlify.com/start
2. 选择 "Import from GitHub"
3. 选择你的 writequest 仓库
4. 构建设置:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 Deploy

#### 方法 B: 手动部署
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 部署
cd writequest
netlify deploy --prod --dir=dist
```

---

### 4. Cloudflare Pages 部署

1. 访问 https://dash.cloudflare.com/pages
2. 点击 "Create a project"
3. 连接 GitHub 账号，选择 writequest 仓库
4. 构建设置:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`
5. 点击 Save and Deploy

---

## 配置文件说明

### vite.config.ts
- `base: './'` - 使用相对路径，支持所有静态托管平台
- 代码分割优化，提升加载速度

### vercel.json
- Vercel 平台配置
- 支持 SPA 路由（所有路由指向 index.html）
- 静态资源长期缓存

### netlify.toml
- Netlify 平台配置
- SPA 重定向规则
- 缓存优化

### .github/workflows/deploy.yml
- GitHub Actions 自动部署配置
- 推送到 main 分支自动触发部署

---

## 自定义域名（可选）

### Vercel 自定义域名
1. 访问项目 Dashboard
2. Settings → Domains
3. 添加你的域名
4. 按提示配置 DNS

### Netlify 自定义域名
1. 访问项目 Dashboard
2. Domain settings
3. 添加自定义域名
4. 配置 DNS 指向 Netlify

---

## 部署后验证清单

- [ ] Landing Page 正常显示
- [ ] 可以点击进入应用
- [ ] 角色创建功能正常
- [ ] 写作编辑器可用
- [ ] 所有游戏功能正常
- [ ] 移动端响应式正常

---

## 故障排除

### 问题: 页面空白或 404
**解决**: 检查 `vite.config.ts` 中的 `base` 配置
- GitHub Pages: `base: '/writequest/'`
- 其他平台: `base: './'`

### 问题: 路由刷新 404
**解决**: 已配置 SPA 回退规则，确保 `_redirects` 或 `vercel.json` 正确

### 问题: 资源加载失败
**解决**: 检查浏览器开发者工具 Network 面板，确保路径正确

---

## 预计部署时间

| 平台 | 首次部署 | 后续更新 |
|-----|---------|---------|
| GitHub Pages | 3-5 分钟 | 2-3 分钟 |
| Vercel | 1-2 分钟 | 30 秒 |
| Netlify | 2-3 分钟 | 1 分钟 |
| Cloudflare | 2-3 分钟 | 1 分钟 |

---

## 推荐方案

**最佳组合**: GitHub + Vercel
- GitHub 托管代码
- Vercel 自动部署（每次 push 自动更新）
- 全球 CDN 加速
- 免费 HTTPS

祝你部署顺利！🚀
