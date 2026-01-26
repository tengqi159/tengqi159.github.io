#!/bin/bash

echo "🚀 部署学术主页到 GitHub Pages"
echo "================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误：请在 tengqi.github.io 目录下运行此脚本"
    exit 1
fi

# 显示当前状态
echo "📊 当前 Git 状态："
git status --short
echo ""

# 询问用户
read -p "是否要推送到 GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 正在推送到 GitHub..."
    
    # 尝试推送
    if git push -u origin main; then
        echo ""
        echo "✅ 推送成功！"
        echo ""
        echo "🌐 你的网站将在几分钟内部署到："
        echo "   https://tengqi159.github.io"
        echo ""
        echo "💡 提示："
        echo "   - 首次部署可能需要 1-2 分钟"
        echo "   - 访问 https://github.com/tengqi159/tengqi159.github.io/settings/pages 查看部署状态"
    else
        echo ""
        echo "❌ 推送失败！"
        echo ""
        echo "可能的原因："
        echo "1. 仓库不存在 - 请访问 https://github.com/new 创建 tengqi159.github.io 仓库"
        echo "2. 认证失败 - 请运行以下命令设置凭据："
        echo "   git config --global user.name 'tengqi159'"
        echo "   git config --global user.email 'teqi159@gmail.com'"
        echo ""
        echo "3. 使用 Personal Access Token："
        echo "   a. 访问 https://github.com/settings/tokens"
        echo "   b. 生成新 token (勾选 repo 权限)"
        echo "   c. 运行: git push https://YOUR_TOKEN@github.com/tengqi159/tengqi159.github.io.git main"
        echo ""
        exit 1
    fi
else
    echo "❌ 取消推送"
    exit 0
fi
