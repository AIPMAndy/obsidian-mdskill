# Obsidian 控制台诊断脚本

在 Obsidian 中打开插件预览面板后，按 Cmd+Option+I 打开开发者工具，在 Console 中粘贴以下代码：

```javascript
// ============ 诊断脚本 ============
(function() {
  console.clear();
  console.log('%c=== MDskill 诊断开始 ===', 'color: #0f0; font-size: 16px; font-weight: bold');
  
  // 1. 检查预览容器
  const container = document.querySelector('.wechat-publisher-preview-content');
  if (!container) {
    console.error('❌ 未找到预览容器 .wechat-publisher-preview-content');
    console.log('请确保已打开 MDskill 预览面板');
    return;
  }
  console.log('✅ 找到预览容器');
  
  // 2. 检查 head 中的主题样式
  const themeStyle = document.getElementById('mdskill-theme-style');
  if (!themeStyle) {
    console.error('❌ head 中没有 #mdskill-theme-style');
    console.log('说明样式没有被注入，或者插件没有初始化');
  } else {
    console.log('✅ 找到主题样式标签');
    console.log('   CSS 长度:', themeStyle.textContent.length);
    console.log('   CSS 前 200 字符:', themeStyle.textContent.substring(0, 200));
  }
  
  // 3. 检查预览内容
  const preview = container.querySelector('.mdskill-preview');
  if (!preview) {
    console.error('❌ 预览容器中没有 .mdskill-preview');
  } else {
    console.log('✅ 找到 .mdskill-preview 容器');
    
    // 4. 检查实际应用的样式
    const h2 = preview.querySelector('h2');
    if (h2) {
      const computed = window.getComputedStyle(h2);
      console.log('%c📐 H2 实际样式:', 'color: #0ff; font-weight: bold');
      console.log('   color:', computed.color);
      console.log('   font-size:', computed.fontSize);
      console.log('   font-family:', computed.fontFamily.substring(0, 50));
      console.log('   border-bottom:', computed.borderBottom);
      console.log('   font-weight:', computed.fontWeight);
    }
    
    const p = preview.querySelector('p');
    if (p) {
      const computed = window.getComputedStyle(p);
      console.log('%c📐 P 实际样式:', 'color: #0ff; font-weight: bold');
      console.log('   color:', computed.color);
      console.log('   line-height:', computed.lineHeight);
    }
  }
  
  // 5. 检查主题选择器
  const selector = document.querySelector('.wechat-publisher-style-selector');
  if (!selector) {
    console.error('❌ 未找到主题选择器');
  } else {
    console.log('✅ 找到主题选择器');
    console.log('   当前主题:', selector.value);
    console.log('   可用主题数:', selector.options.length);
  }
  
  console.log('%c=== 诊断完成 ===', 'color: #0f0; font-size: 16px; font-weight: bold');
  console.log('\n下一步：在主题选择器中选择不同主题，观察 Console 输出和右侧预览变化');
})();
```

## 预期结果

如果一切正常，应该看到：
- ✅ 找到预览容器
- ✅ 找到主题样式标签
- ✅ 找到 .mdskill-preview 容器
- 📐 显示 H2 和 P 的实际样式（颜色、字体、大小）

## 如果样式没生效

检查 H2 的实际样式值：
- 如果 `font-size` 是 24px、26px 等 → 主题样式已生效 ✅
- 如果 `font-size` 是 16px 或其他默认值 → 主题样式被覆盖 ❌

## 测试主题切换

1. 在选择器中选择不同主题
2. 观察 Console 是否输出 `[MDskill] 主题切换: xxx`
3. 观察右侧预览的颜色、字体、大小是否改变
4. 再次运行上面的诊断脚本，查看新的样式值

