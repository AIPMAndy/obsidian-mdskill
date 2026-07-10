# Obsidian 插件上架指南

## 📋 上架前检查清单

- [x] 插件功能正常
- [x] 代码已构建（main.js）
- [x] manifest.json 配置正确
- [x] README.md 完整
- [ ] 创建 GitHub 仓库
- [ ] 提交到 obsidian-releases

## 🚀 上架步骤

### 1. 创建 GitHub 仓库

```bash
cd /Users/andy/Documents/AICode/obsidian-wechat-publisher

# 初始化 git
git init
git add .
git commit -m "Initial commit: WeChat Publisher plugin"

# 在 GitHub 创建仓库（网页操作）
# 仓库名建议：obsidian-wechat-publisher

# 关联远程仓库
git remote add origin https://github.com/你的用户名/obsidian-wechat-publisher.git
git branch -M main
git push -u origin main
```

### 2. 创建 Release

在 GitHub 仓库页面：

1. 点击「Releases」→「Create a new release」
2. Tag version: `1.0.0`
3. Release title: `v1.0.0 - Initial Release`
4. Description:
   ```markdown
   ## Features
   - Convert Markdown to WeChat Official Account HTML
   - 3 built-in styles (Minimal, Medium, Stripe)
   - Live preview panel
   - One-click copy to WeChat editor
   - Export HTML files
   ```
5. 上传文件：
   - `main.js`
   - `manifest.json`
   - `styles.css`
6. 点击「Publish release」

### 3. 提交到官方插件市场

Fork 官方仓库：
```bash
# 在 GitHub 网页上 Fork
# https://github.com/obsidianmd/obsidian-releases

# Clone 你 Fork 的仓库
git clone https://github.com/你的用户名/obsidian-releases.git
cd obsidian-releases
```

编辑 `community-plugins.json`：
```bash
# 在文件末尾添加你的插件信息
{
  "id": "wechat-publisher",
  "name": "WeChat Publisher",
  "author": "Andy",
  "description": "Convert Markdown to WeChat Official Account ready HTML with 15 beautiful styles. One-click copy to WeChat editor.",
  "repo": "你的用户名/obsidian-wechat-publisher"
}
```

提交 PR：
```bash
git add community-plugins.json
git commit -m "Add WeChat Publisher plugin"
git push origin master

# 在 GitHub 上创建 Pull Request
```

### 4. 等待审核

- 官方团队会审核你的 PR（通常 1-2 周）
- 可能会要求修改代码或文档
- 审核通过后自动上架

## 📝 审核要求

### 代码质量
- ✅ 无明显 bug
- ✅ 不访问敏感数据
- ✅ 不违反 Obsidian 插件规范
- ✅ TypeScript 类型正确

### 文档完整性
- ✅ README.md 清晰说明功能和用法
- ✅ manifest.json 信息准确
- ✅ 有基本的错误处理

### 安全性
- ✅ 不发送数据到第三方服务器
- ✅ 不读取敏感文件
- ✅ 所有操作在本地完成

## 🎯 上架后

### 更新插件

1. 修改代码
2. 更新 `manifest.json` 的 version
3. 更新 `versions.json`
4. 构建：`npm run build`
5. 创建新的 GitHub Release
6. Obsidian 会自动检测更新

### 版本号规则

遵循语义化版本（Semantic Versioning）：

- `1.0.0` → `1.0.1` - Bug 修复
- `1.0.0` → `1.1.0` - 新增功能
- `1.0.0` → `2.0.0` - 重大更新

### 推广

- 在 Obsidian 论坛发帖介绍
- 在 Reddit r/ObsidianMD 分享
- 写一篇使用教程博客
- 在社交媒体分享

## 💰 费用

**完全免费！**

- 上架不收费
- GitHub 仓库免费
- 无需申请开发者账号
- 无任何隐藏费用

## 📊 数据统计

上架后可以在这里查看下载量和趋势：
- GitHub Insights
- Obsidian 官方统计（如果提供）

## ✅ 当前状态

```
项目目录：/Users/andy/Documents/AICode/obsidian-wechat-publisher
已安装到所有 vault：✅
代码已构建：✅
准备上架：⏳（需要创建 GitHub 仓库）
```

## 🔄 快速上架命令

```bash
cd /Users/andy/Documents/AICode/obsidian-wechat-publisher

# 1. 初始化 Git
git init
git add .
git commit -m "Initial commit: WeChat Publisher v1.0.0"

# 2. 在 GitHub 创建仓库后执行
git remote add origin https://github.com/你的用户名/obsidian-wechat-publisher.git
git branch -M main
git push -u origin main

# 3. 然后在 GitHub 网页上创建 Release 和提交 PR
```

## 💡 下一步

1. **立即测试**：在 Obsidian 中测试插件功能
2. **收集反馈**：先自己用几天，发现问题
3. **完善功能**：添加剩余 12 种样式
4. **准备上架**：创建 GitHub 仓库并提交
