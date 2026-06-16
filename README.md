# ぼっちTodo — 孤独的待办清单

> 二次元 / 程序员风格的本地 TODO PWA，基于「孤独摇滚！」主题设计。

## 功能特性

- 添加 / 完成 / 删除待办任务
- 三级优先级切换（普通 → 中等 → 紧急）
- 全部 / 进行中 / 已完成 筛选
- 每日自动更换担当角色主题色（波奇 → 虹夏 → 凉 → 喜多）
- 每日轮换「孤独摇滚」梗 / 名句
- localStorage 持久化，数据保存在本地浏览器
- PWA 离线支持，可安装到桌面

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | React 19 |
| 构建 | Vite 8 |
| PWA | vite-plugin-pwa + Workbox |
| 样式 | 纯 CSS（CSS 变量主题系统） |
| 部署 | GitHub Pages + Actions CI |

## 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 http://localhost:5173

### 生产构建

```bash
npm run build
```

产物输出到 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署。推送到 `main` 分支即触发构建和发布。

### 手动部署步骤

1. 在 GitHub 仓库 Settings → Pages 中，Source 选择 **GitHub Actions**
2. 推送代码到 `main` 分支
3. 等待 Actions workflow `Deploy to GitHub Pages` 完成
4. 访问 `https://<用户名>.github.io/<仓库名>/`

### 修改部署路径

如果仓库名不是 `bocchi-todo`，需修改 `vite.config.js` 中的 `base` 和 manifest 的 `start_url` / `scope`：

```js
base: '/your-repo-name/',
// ...
start_url: '/your-repo-name/',
scope: '/your-repo-name/',
```

## PWA 安装

### Chrome / Edge（桌面）

1. 打开应用页面
2. 地址栏右侧出现安装图标，点击安装
3. 或菜单 → 安装 ぼっちTodo

### Safari（macOS）

1. 打开应用页面
2. 菜单栏 → 添加到 Dock

### Safari（iOS）

1. 打开应用页面
2. 点击分享按钮（方框+箭头）
3. 选择「添加到主屏幕」

### Android Chrome

1. 打开应用页面
2. 菜单 → 添加到主屏幕

## 数据存储

- 所有数据保存在浏览器 `localStorage`
- Key：`bocchitodo:items`
- 不依赖任何后端服务
- 清除浏览器数据会丢失待办记录

## 项目结构

```
├── index.html                # 入口 HTML
├── vite.config.js            # Vite + PWA 配置
├── public/
│   ├── icon.svg              # PWA 图标
│   └── icons.svg             # 备用图标
├── src/
│   ├── main.jsx              # React 入口
│   ├── App.jsx               # 主组件 + 状态管理
│   ├── index.css             # 全局样式 + 主题变量
│   └── components/
│       ├── Header.jsx        # 标题 + 日期
│       ├── BandStripe.jsx    # 角色色带
│       ├── TodoInput.jsx     # 输入框 + 优先级
│       ├── FilterTabs.jsx    # 筛选标签
│       ├── EmptyState.jsx    # 空状态
│       └── StatusBar.jsx     # 底部统计栏
└── .github/workflows/
    └── deploy.yml            # GitHub Pages 自动部署
```

## 每日主题

按年中天数 mod 4 轮换担当角色，控制主题色和副标题：

| 余数 | 角色 | 色值 |
|------|------|------|
| 0 | 波奇（后藤一里） | `#de7b8e` 粉 |
| 1 | 虹夏（伊地知虹夏） | `#d4a03c` 金 |
| 2 | 凉（山田凉） | `#6889a8` 蓝 |
| 3 | 喜多（喜多郁代） | `#c9505e` 红 |

## 角色图片

每日担当会显示对应角色的头像图片，每4天轮换一次图片（不重复）。请将图片文件放在 `public/images/` 目录下：

```
public/images/
├── bocchi-1.png    # 波奇图片1
├── bocchi-2.png    # 波奇图片2
├── bocchi-3.png    # 波奇图片3
├── bocchi-4.png    # 波奇图片4
├── nijika-1.png    # 虹夏图片1
├── nijika-2.png    # 虹夏图片2
├── nijika-3.png    # 虹夏图片3
├── nijika-4.png    # 虹夏图片4
├── ryou-1.png      # 凉图片1
├── ryou-2.png      # 凉图片2
├── ryou-3.png      # 凉图片3
├── ryou-4.png      # 凉图片4
├── kita-1.png      # 喜多图片1
├── kita-2.png      # 喜多图片2
├── kita-3.png      # 喜多图片3
└── kita-4.png      # 喜多图片4
```

**图片要求**：
- 格式：PNG（推荐）或 JPG
- 尺寸：建议 128x128 像素或更大（会自动裁剪为圆形）
- 文件大小：建议小于 100KB

## 安全说明

- 纯前端应用，无后端、无 API 调用
- 无硬编码密钥或敏感信息
- 无 eval / innerHTML 等危险操作
- React JSX 自动转义，防 XSS
- 所有外部链接均为 HTTPS（Google Fonts）
- 依赖均为官方 npm 包，无已知高危漏洞

## License

MIT
