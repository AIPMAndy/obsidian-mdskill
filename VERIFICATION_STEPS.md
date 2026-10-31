# 主题切换修复验证步骤

## 修复内容
1. **问题**：切换主题时样式不生效
2. **根本原因**：CSS 选择器（`body{...}h1{...}`）被错误地作为 inline style 应用
3. **解决方案**：
   - 使用 `<style>` 标签包裹 CSS
   - 添加 `.mdskill-preview` 作用域前缀
   - 将所有元素选择器转换为 `.mdskill-preview element` 形式

## 已修改的文件
- `main.ts` (line 263-265): 修改了 `convertMarkdownToHTML` 函数的返回值
- `styles.css` (line 60-67): 移除了可能覆盖主题样式的 background/padding

## 验证步骤

### 1. 重启 Obsidian
```bash
pkill Obsidian && open -a Obsidian
```

### 2. 打开任意 vault 和 Markdown 文件
- 打开一个包含标题、段落、引用的 Markdown 文件

### 3. 打开公众号预览面板
- 点击左侧 ribbon 的手机图标
- 或使用命令面板: Cmd+P → "打开公众号预览"

### 4. 测试主题切换
切换以下主题并观察右侧预览样式变化：

| 主题 | 预期效果 |
|------|---------|
| 多彩活力 (playful) | 蓝色 H2 标题 (#0066cc)，金色引用边框 (#d4af37) |
| 极简现代 (minimal) | 黑色 H2 标题 (#111827)，灰色背景 (#fafafa) |
| 纽约时报 (nytimes) | 黑色标题，灰色引用边框 (#999999) |
| Wired 连线 (wired) | 蓝色 H2 (#0066ff)，蓝色下划线 |
| 禅意留白 (zen) | 居中 H1，超大行距 (2.2) |

### 5. 验证要点
- [ ] H1 标题字体大小和颜色随主题变化
- [ ] H2 标题颜色和下划线随主题变化
- [ ] 段落字体、行距、颜色随主题变化
- [ ] 引用块边框颜色和背景随主题变化
- [ ] 整体背景色随主题变化
- [ ] 切换主题不会显示"请导入md文件"

## 技术验证

### CSS Scoping 测试
```javascript
// 原始 CSS
body{font-size:17px;}h1{color:#0066cc;}

// 转换后的 CSS
.mdskill-preview {font-size:17px;}.mdskill-preview h1 {color:#0066cc;}
```

### HTML 输出结构
```html
<style>
.mdskill-preview {font-family:...}
.mdskill-preview h1 {...}
.mdskill-preview h2 {...}
</style>
<div class="mdskill-preview">
  <h1>标题</h1>
  <p>段落</p>
</div>
```

## 如果仍有问题

### 调试方法
1. 打开 Obsidian Developer Tools: Cmd+Option+I
2. 在 Console 中检查是否有 CSS 错误
3. 在 Elements 面板检查 `.mdskill-preview` 的样式是否正确应用
4. 检查是否有其他 CSS 覆盖了主题样式

### 可能的问题
- Obsidian 的全局 CSS 覆盖
- 插件未正确重载
- CSS 选择器优先级问题

## 部署状态
已部署到以下 10 个 vault：
1. /Users/andy
2. /Users/andy/Desktop
3. /Users/andy/Desktop/01 AI+IP
4. /Users/andy/Desktop/02 AI+产品
5. /Users/andy/Desktop/03 AI+投资
6. /Users/andy/Desktop/05 AI知识视频
7. /Users/andy/Desktop/AndyDATA
8. /Users/andy/Desktop/待处理
9. /Users/andy/Documents
10. /Users/andy/Documents/ObsidianVault
