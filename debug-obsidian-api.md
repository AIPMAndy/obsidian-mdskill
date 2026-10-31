# Obsidian API 分析

## 问题
`document.head.createEl("style")` 可能不是有效的 DOM API。

标准 DOM API 是：
- `document.createElement("style")`  ✅ 标准
- `element.appendChild(styleEl)`     ✅ 标准

Obsidian 的 `createEl()` 是它自己的 API，用在普通 DOM 元素上可能有问题。

## document.head 不是 Obsidian 元素
`document.head` 是原生 DOM 元素，不是 Obsidian 的 HTMLElement wrapper，
所以它**没有** `createEl()` 方法！

## 正确做法
```typescript
// ❌ 错误 - document.head 没有 createEl
this.themeStyleEl = document.head.createEl('style');

// ✅ 正确 - 使用标准 DOM API
this.themeStyleEl = document.createElement('style');
document.head.appendChild(this.themeStyleEl);
```
