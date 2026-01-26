# 学术个人主页

这是一个基于 Jekyll 的现代化学术个人主页，设计简洁美观，功能完善。

## 特性

- 🎨 现代化设计，使用渐变色和卡片式布局
- 📱 完全响应式，支持各种设备
- 🚀 快速加载，优化的性能
- 📝 易于维护，使用 Markdown 和 YAML 配置
- 🔍 SEO 优化
- 📊 学术统计展示
- 📚 论文自动分组和展示
- 🔬 研究方向展示
- 📢 新闻时间线
- 🎓 招生信息页面

## 本地开发

### 前置要求

- Ruby 2.7+
- Bundler

### 安装

```bash
# 安装依赖
bundle install

# 启动本地服务器
bundle exec jekyll serve

# 访问 http://localhost:4000
```

### 构建

```bash
bundle exec jekyll build
```

生成的网站将在 `_site` 目录中。

## 配置

### 基本信息

编辑 `_config.yml` 文件更新个人信息：

```yaml
author:
  name: "你的姓名"
  position: "职位"
  affiliation: "单位"
  email: "邮箱"
  # ... 其他信息
```

### 添加论文

编辑 `_data/publications.yml` 文件：

```yaml
- title: "论文标题"
  venue: "发表场所"
  year: 2024
  type: "journal"  # journal, conference, preprint
  citations: 10
  highlight: true  # 是否高亮显示
  pdf: "链接"      # 可选
  code: "链接"     # 可选
  project: "链接"  # 可选
```

### 更新新闻

编辑 `_data/news.yml` 文件：

```yaml
- date: "2024/01"
  content: "新闻内容"
```

### 修改研究方向

编辑 `_data/research_areas.yml` 文件：

```yaml
- icon: "🤖"
  title: "研究方向名称"
  description: "简短描述"
```

## 目录结构

```
CV/
├── _config.yml           # 网站配置
├── _data/               # 数据文件
│   ├── navigation.yml   # 导航菜单
│   ├── publications.yml # 论文数据
│   ├── news.yml        # 新闻数据
│   └── research_areas.yml # 研究方向
├── _includes/          # 可复用组件
│   ├── header.html
│   └── footer.html
├── _layouts/           # 页面布局
│   ├── default.html
│   ├── home.html
│   └── page.html
├── _pages/             # 页面内容
│   ├── publications.md
│   ├── projects.md
│   ├── cv.md
│   └── admissions.md
├── assets/             # 静态资源
│   ├── css/
│   ├── js/
│   └── images/
└── index.md            # 首页
```

## 部署到 GitHub Pages

1. 创建 GitHub 仓库（如 `username.github.io`）
2. 推送代码到仓库
3. 在仓库设置中启用 GitHub Pages
4. 选择 `main` 分支作为源
5. 访问 `https://username.github.io`

## 自定义样式

主要样式文件：
- `assets/css/main.css` - 全局样式和组件
- `assets/css/home.css` - 首页特定样式

CSS 变量定义在 `main.css` 的 `:root` 中，可以轻松自定义颜色、间距等。

## 许可证

MIT License

## 联系

如有问题，请联系：{{ site.author.email }}
