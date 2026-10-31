// 在 Obsidian 控制台中运行此脚本来验证主题切换功能
// 复制整段代码，打开 Obsidian，按 Cmd+Option+I，粘贴到 Console，按回车

(function() {
  console.log('=== Obsidian MDskill 主题切换验证脚本 ===');
  
  // 1. 查找预览容器
  const previewEl = document.querySelector('.wechat-publisher-preview-content');
  if (!previewEl) {
    console.error('❌ 未找到预览容器 .wechat-publisher-preview-content');
    console.log('请先打开 MDskill 插件的预览面板');
    return;
  }
  console.log('✅ 找到预览容器');
  
  // 2. 检查容器内的结构
  const styleEls = previewEl.querySelectorAll('style');
  const mdskillDiv = previewEl.querySelector('.mdskill-preview');
  
  console.log('📊 当前状态:');
  console.log('  - style 标签数量:', styleEls.length);
  console.log('  - .mdskill-preview 容器:', mdskillDiv ? '存在' : '不存在');
  
  if (styleEls.length === 0) {
    console.error('❌ 没有 style 标签！样式无法应用');
  } else {
    console.log('✅ 找到 style 标签');
    console.log('  - CSS 长度:', styleEls[0].textContent.length);
    console.log('  - CSS 前 100 字符:', styleEls[0].textContent.substring(0, 100));
  }
  
  if (!mdskillDiv) {
    console.error('❌ 没有 .mdskill-preview 容器！CSS 作用域无法工作');
  } else {
    console.log('✅ 找到 .mdskill-preview 容器');
    
    // 3. 检查实际应用的样式
    const h2 = mdskillDiv.querySelector('h2');
    if (h2) {
      const computed = window.getComputedStyle(h2);
      console.log('📐 H2 元素的实际样式:');
      console.log('  - color:', computed.color);
      console.log('  - font-size:', computed.fontSize);
      console.log('  - border-bottom:', computed.borderBottom);
      console.log('  - font-family:', computed.fontFamily.substring(0, 50));
    }
  }
  
  // 4. 查找主题选择器
  const selector = document.querySelector('.wechat-publisher-style-selector');
  if (!selector) {
    console.error('❌ 未找到主题选择器');
  } else {
    console.log('✅ 找到主题选择器');
    console.log('  - 当前主题:', selector.value);
    console.log('  - 主题总数:', selector.options.length);
    
    // 5. 测试主题切换
    if (selector.options.length >= 2) {
      console.log('\n🧪 开始测试主题切换...');
      const originalTheme = selector.value;
      const testTheme = selector.options[1].value;
      
      console.log('  切换前主题:', originalTheme);
      
      // 触发切换
      selector.value = testTheme;
      selector.dispatchEvent(new Event('change'));
      
      // 等待一下让 DOM 更新
      setTimeout(() => {
        const newStyleEls = previewEl.querySelectorAll('style');
        const newMdskillDiv = previewEl.querySelector('.mdskill-preview');
        
        console.log('  切换后主题:', selector.value);
        console.log('  style 标签数量:', newStyleEls.length);
        
        if (newStyleEls.length > 0) {
          const newH2 = newMdskillDiv ? newMdskillDiv.querySelector('h2') : null;
          if (newH2) {
            const newComputed = window.getComputedStyle(newH2);
            console.log('📐 切换后 H2 样式:');
            console.log('  - color:', newComputed.color);
            console.log('  - font-size:', newComputed.fontSize);
            console.log('  - border-bottom:', newComputed.borderBottom);
          }
        }
        
        // 切回原主题
        selector.value = originalTheme;
        selector.dispatchEvent(new Event('change'));
        
        console.log('\n✅ 测试完成！如果上面的颜色/字体在切换前后不同，说明主题切换正常工作');
      }, 100);
    }
  }
  
  console.log('\n=== 验证完成 ===');
})();
