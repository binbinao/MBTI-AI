# MBTI-AI 性格测试系统

一个现代化的MBTI性格测试系统，结合AI分析为用户提供详细的性格类型解读。

## 🚀 功能特性

- **多种测试模式**：最短测试(8题)、标准测试(28题)、扩展测试(100+题)
- **AI智能分析**：基于腾讯云LKEAP的深度性格分析
- **现代化UI**：渐变色彩、玻璃态设计、流畅动画
- **响应式设计**：完美适配桌面端和移动端
- **无障碍支持**：完整的ARIA标签和键盘导航

## 🛠️ 技术栈

### 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- 现代CSS特性 (Grid, Flexbox, CSS Variables)
- 无障碍性 (Accessibility)

### 后端
- Node.js + Express
- 腾讯云LKEAP AI服务
- CORS支持

### 部署
- Vercel (前端 + Serverless Functions)

## 📦 部署说明

### Vercel部署

1. **Fork并部署到Vercel**
   ```bash
   # 推送到GitHub后，在Vercel中导入项目
   git push origin master
   ```

2. **配置环境变量**
   在Vercel项目设置中添加以下环境变量：
   ```
   LKEAP_API_KEY=your_tencent_cloud_api_key
   LKEAP_API_URL=https://api.lkeap.cloud.tencent.com/v1/chat/completions
   NODE_ENV=production
   ```

3. **自动部署**
   - 推送代码到GitHub会自动触发Vercel部署
   - 前端和后端API会自动配置和启动

### 本地开发

1. **安装依赖**
   ```bash
   cd server
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑.env文件，添加API密钥
   ```

3. **启动后端服务**
   ```bash
   cd server
   npm run dev
   ```

4. **启动前端服务**
   ```bash
   # 在项目根目录
   npm run serve
   ```

## 📁 项目结构

```
MBTI-AI/
├── index.html              # 主页面
├── styles.css              # 样式文件
├── script.js               # 前端逻辑
├── package.json            # 项目配置
├── vercel.json             # Vercel部署配置
├── .vercelignore           # Vercel忽略文件
├── config/
│   └── api-config.js       # API配置
├── server/
│   ├── api/
│   │   └── lkeap.js        # Vercel Serverless Function
│   ├── package.json        # 后端依赖
│   └── test.js             # 测试文件
├── services/
│   └── lkeap-ai-service.js # AI服务
└── .env.example            # 环境变量示例
```

## 🎨 UI特性

- **现代渐变设计**：多层渐变背景和玻璃态效果
- **流畅动画**：页面切换、悬停、点击动画
- **响应式布局**：Grid和Flexbox结合
- **深色模式支持**：自动适配系统主题
- **无障碍性**：完整的屏幕阅读器支持

## 🔧 配置说明

### API配置
- `config/api-config.js`：自动识别开发和生产环境
- 开发环境：`http://localhost:3000`
- 生产环境：相对路径（Vercel自动处理）

### Vercel配置
- `vercel.json`：定义构建和路由规则
- 自动代理`/api/*`请求到Serverless Functions
- 静态文件直接服务

## 🌐 环境变量

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `LKEAP_API_KEY` | 腾讯云API密钥 | ✅ |
| `LKEAP_API_URL` | API端点URL | ❌ |
| `NODE_ENV` | 运行环境 | ❌ |

## 📱 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License