# 表格显示问题修复总结

## 问题描述

Obsidian-MDskill 插件在渲染 Markdown 表格时无法正确转换为 HTML，导致表格在预览中显示为原始 Markdown 文本而非格式化的表格。

## 根本原因

`convertMarkdownToHTMLOnly` 函数（main.ts:392-538）中**完全缺失表格解析逻辑**，只处理了：
- 标题（h1-h6）
- 段落（p）
- 列表（ul/ol）
- 代码块（pre/code）
- 引用（blockquote）
- 分割线（hr）

但没有处理 Markdown 表格语法（`| col1 | col2 |`）。

## 修复内容

### 1. 添加表格解析逻辑（main.ts:392-580）

在 `convertMarkdownToHTMLOnly` 方法中添加：

```typescript
// 新增状态变量
let inTable = false;
let tableRows: string[] = [];
let tableHeaders: string[] = [];

// 新增辅助函数
const flushTable = () => {
  if (tableHeaders.length > 0 || tableRows.length > 0) {
    html += '<table>';
    if (tableHeaders.length > 0) {
      html += '<thead><tr>';
      tableHeaders.forEach(header => {
        html += '<th>' + this.processInline(header.trim()) + '</th>';
      });
      html += '</tr></thead>';
    }
    if (tableRows.length > 0) {
      html += '<tbody>';
      tableRows.forEach(row => {
        html += '<tr>';
        row.split('|').slice(1, -1).forEach(cell => {
          html += '<td>' + this.processInline(cell.trim()) + '</td>';
        });
        html += '</tr>';
      });
      html += '</tbody>';
    }
    html += '</table>';
    tableHeaders = [];
    tableRows = [];
  }
  inTable = false;
};

const isTableRow = (line: string): boolean => {
  return line.trim().startsWith('|') && line.trim().endsWith('|');
};

const isTableDelimiter = (line: string): boolean => {
  return /^\|[\s:-]+\|/.test(line.trim());
};
```

### 2. 添加表格检测逻辑

在主循环中添加表格检测：

```typescript
// Table detection
if (isTableRow(line)) {
  // Check if next line is delimiter (header separator)
  if (i + 1 < lines.length && isTableDelimiter(lines[i + 1])) {
    // This is a table header
    flushList();
    flushTable();
    inTable = true;
    tableHeaders = line.split('|').slice(1, -1);
    i++; // Skip the delimiter line
    continue;
  } else if (inTable) {
    // This is a table row
    tableRows.push(line);
    continue;
  }
} else if (inTable) {
  // End of table
  flushTable();
}
```

### 3. 为所有主题添加表格样式

在所有 33 个主题的 CSS 中添加：

```css
table{width:100%;border-collapse:collapse;margin:20px 0;}
th{background:#f5f5f5;border:1px solid #ddd;padding:10px;text-align:left;font-weight:600;}
td{border:1px solid #ddd;padding:10px;text-align:left;}
```

### 4. 更新样式作用域化逻辑

在 `updatePreview`、`copyToClipboard` 和 `exportHTML` 三个方法中，添加表格元素的作用域化：

```typescript
.replace(/\}table\s*\{/g, '}.mdskill-preview table {')
.replace(/\}th\s*\{/g, '}.mdskill-preview th {')
.replace(/\}td\s*\{/g, '}.mdskill-preview td {');
```

并在 `!important` 强制覆盖的属性列表中添加：`border`、`border-collapse`、`width`、`text-align`。

## 修复效果

### 修复前
```
| 方案 | 类型 | 优点 | 缺点 | 推荐度 |
| ---- | ---- | ---- | ---- | ------ |
| Obsidian Web Clipper | 官方插件 | 官方支持 | 需要两步安装 | ⭐⭐⭐⭐ |
```
显示为原始文本，管道符和破折号直接可见。

### 修复后
表格正确渲染为 HTML `<table>`，带有：
- 表头行（`<thead>` + `<th>`）有灰色背景
- 数据行（`<tbody>` + `<td>`）有边框和内边距
- 自动响应式宽度（100%）
- 左对齐文本
- 清晰的单元格边界

## 测试验证

1. 打开 Obsidian
2. 启用 Obsidian-MDskill 插件
3. 创建包含表格的 Markdown 文件（见 `TEST_TABLE.md`）
4. 打开"公众号预览"侧边栏
5. 验证表格正确显示为格式化的 HTML 表格

## 文件变更

- `main.ts`: 
  - 添加表格解析逻辑（+70 行）
  - 所有主题添加表格样式（33 处修改）
  - 样式作用域化添加表格支持（3 处修改）

## 兼容性

✅ 支持标准 Markdown 表格语法
✅ 支持表格内的行内格式（加粗、斜体、代码、链接等）
✅ 与现有的 33 个主题完全兼容
✅ 复制到剪贴板和导出 HTML 均包含表格样式

## 已知限制

- 不支持合并单元格（Markdown 标准不支持）
- 表格宽度固定为 100%（响应式设计）
- 对齐方式统一为左对齐（可通过 CSS 自定义）

## 后续优化建议

1. 支持列对齐语法（`:---`、`:---:`、`---:`）
2. 为不同主题定制不同的表格配色方案
3. 支持表格行斑马纹效果
4. 添加表格悬停高亮效果
