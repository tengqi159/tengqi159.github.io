# 部署指南

## 🚀 快速部署

你的新学术主页已经准备好了！现在需要推送到 GitHub。

### 方法 1: 使用部署脚本（推荐）

```bash
cd tengqi.github.io
./deploy.sh
```

### 方法 2: 手动推送

#### 步骤 1: 确保 GitHub 仓库存在

访问 https://github.com/tengqi159/tengqi159.github.io

如果仓库不存在，请：
1. 访问 https://github.com/new
2. 仓库名称填写：`tengqi159.github.io`
3. 选择 Public
4. 不要初始化 README
5. 点击 "Create repository"

#### 步骤 2: 推送代码

```bash
cd tengqi.github.io

# 如果仓库是新创建的
git push -u origin main

# 如果需要强制推送（覆盖远程内容）
git push -f origin main
```

#### 步骤 3: 配置 GitHub Pages

1. 访问 https://github.com/tengqi159/tengqi159.github.io/settings/pages
2. Source 选择：`Deploy from a branch`
3. Branch 选择：`main` 和 `/ (root)`
4. 点击 Save

### 方法 3: 使用 Personal Access Token

如果遇到认证问题：

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 使用 token 推送：

```bash
git push https://YOUR_TOKEN@github.com/tengqi159/tengqi159.github.io.git main
```

## 📝 推送后

### 查看部署状态

访问：https://github.com/tengqi159/tengqi159.github.io/actions

### 访问网站

部署成功后（通常 1-2 分钟），访问：
**https://tengqi159.github.io**

## 🔧 常见问题

### Q: 推送失败，提示 "Repository not found"

**A:** 仓库可能不存在或名称不正确。请：
1. 访问 https://github.com/tengqi159 确认仓库列表
2. 如果没有 `tengqi159.github.io`，按照上面步骤创建
3. 确认仓库名称拼写正确

### Q: 推送失败，提示认证错误

**A:** 使用 Personal Access Token（见方法 3）

### Q: 网站显示 404

**A:** 
1. 检查 GitHub Pages 设置是否正确
2. 确认 `index.html` 文件在仓库根目录
3. 等待 1-2 分钟让 GitHub Pages 完成部署

### Q: 样式没有加载

**A:** 
1. 检查浏览器控制台是否有错误
2. 确认 `assets/css/style.css` 文件存在
3. 清除浏览器缓存后刷新

## 📱 后续更新

每次修改内容后：

```bash
cd tengqi.github.io
git add .
git commit -m "更新内容"
git push origin main
```

GitHub Pages 会自动重新部署。

## 📞 需要帮助？

如果遇到问题，请：
1. 检查 GitHub Actions 日志
2. 查看浏览器控制台错误
3. 确认所有文件都已正确推送

---

**祝部署顺利！🎉**
